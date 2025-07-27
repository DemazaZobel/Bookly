import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { user as User, review as Review, book as Book, bookCategory as BookCategory } from './models/index.js';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/auth.js';
import { isAdmin } from './middleware/adminAuth.js';
import path from 'path';
import upload from './middleware/upload.js';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();
const PORT = 3001;

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

app.use(express.json());



app.get('/api/home', async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        {
          model: Review,
          attributes: ['rating'],
        },
        {
          model: BookCategory,
          attributes: ['id', 'category'], // fetch the category name
        },
      ],
    });

    const booksWithRatings = books.map(book => {
      const reviews = book.Reviews || [];
      const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = reviews.length ? totalRatings / reviews.length : 0;
      const reviewCount = reviews.length;

      return {
        ...book.toJSON(),
        averageRating: parseFloat(avgRating.toFixed(1)),
        reviewCount,
        categoryName: book.BookCategory?.category || 'No category',
      };
    });

    res.json(booksWithRatings);

  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.get("/api/categories", async (req, res) => {
    try {
      const categories = await BookCategory.findAll();
      res.json(categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      res.status(500).json({ message: "Server error" });
    }
});


app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        {
          model: BookCategory,
          attributes: ['id', 'category'],
        }
      ],
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book); 
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/books/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { bookId: req.params.id },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/books/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const { rating, comment } = req.body;
    const userId = req.user.id; 

    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const newReview = await Review.create({
      bookId,
      userId,
      rating,
      comment,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, roleId: 2 });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, roleId: newUser.roleId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ where: { email } });

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found, please register' });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email, roleId: foundUser.roleId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/books', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, author, description, price, categoryId } = req.body;
    let image = '';

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    if (!title || !author || !price) {
      return res.status(400).json({ message: 'Title, author, and price are required' });
    }

    const newBook = await Book.create({ title, author, description, price, categoryId, image });
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/books/:id', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const { title, author, description, price, categoryId } = req.body;

    if (req.file) {
      book.image = `/uploads/${req.file.filename}`;
    }

    book.title = title;
    book.author = author;
    book.description = description;
    book.price = price;
    book.categoryId = categoryId;

    await book.save();

    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a book by ID
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.destroy();
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET admin profile
app.get('/api/admin/profile', authenticateToken, isAdmin, async (req, res) => {
  try {
    const admin = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email'], // don't send password
    });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update admin profile
app.put('/api/admin/profile', authenticateToken, isAdmin, async (req, res) => {
  try {
    const admin = await User.findByPk(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const { name, email, password } = req.body;

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    await admin.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// GET all users (admin only)
app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'roleId'], // select what you want to expose
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId == req.user.id) {
      return res.status(400).json({ message: 'Admins cannot delete themselves here' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



// Get current logged-in user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email'], // exclude password
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update current logged-in user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE review
app.delete('/api/reviews/:id', authenticateToken, async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });

  // Allow if user owns the review OR user is admin (roleId === 1)
  if (review.userId !== req.user.id && req.user.roleId !== 1) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await review.destroy();
  res.json({ message: 'Review deleted' });
});


// PUT review
app.put('/api/reviews/:id', authenticateToken, async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.findByPk(req.params.id);

  if (!review || review.userId !== req.user.id)
    return res.status(403).json({ error: 'Unauthorized or not found' });

  review.rating = rating ?? review.rating;
  review.comment = comment ?? review.comment;
  await review.save();

  res.json({ message: 'Review updated', review });
});



app.post('/api/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;

    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash password before saving (example with bcrypt)
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      roleId, // 1 for admin, 2 for user, etc.
    });

    // Return the new user info (excluding password)
    const { password: _, ...userData } = newUser.toJSON();

    res.status(201).json(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/admin/profile', authenticateToken, async (req, res) => {
  try {
    await User.destroy({ where: { id: req.user.id } });
    res.json({ message: 'Account deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete account.' });
  }
});

app.delete('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
