import Book  from './models/book.js';
import sequelize from './config/db.js';
import BookCategory from './models/bookCategory.js';

async function seedBooks() {
  try {
    const categories = await BookCategory.findAll();
    
    // Build a lookup: { 'Fiction': 3, 'Poetry': 1, ... }
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.category] = cat.id;
    });

    await Book.bulkCreate([
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        description: "A powerful story of racial injustice and childhood innocence set in the American South.",
        image: "/assets/to_kill_a_mocking_bird.jpg",
        price: 15.99,
        categoryId: categoryMap["Classic"],
      },
      {
        title: "1984",
        author: "George Orwell",
        description: "A dystopian novel about totalitarianism, surveillance, and the loss of individual freedom.",
        image: "/assets/1984.jpg",
        price: 14.5,
        categoryId: categoryMap["Dystopian"],
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        description: "A witty romance that critiques class, marriage, and manners in 19th-century England.",
        image: "/assets/pride_and_prejudice.jpg",
        price: 12.99,
        categoryId: categoryMap["Romance"],
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A tragic love story and a critique of the American Dream during the Roaring Twenties.",
        image: "/assets/the_great_gatsby.jpeg",
        price: 13.25,
        categoryId: categoryMap["Classic"],
      },
      {
        title: "One Hundred Years of Solitude",
        author: "Gabriel García Márquez",
        description: "A multi-generational magical realism saga of the Buendía family in Macondo.",
        image: "/assets/100_year_of_solitude.jpeg",
        price: 16.75,
        categoryId: categoryMap["Magical Realism"],
      },
      {
        title: "Crime and Punishment",
        author: "Fyodor Dostoevsky",
        description: "A psychological novel about guilt, morality, and redemption following a murder.",
        image: "/assets/crime_and_punishment.jpeg",
        price: 14.99,
        categoryId: categoryMap["Philosophical Fiction"],
      },
      {
        title: "The Brothers Karamazov",
        author: "Fyodor Dostoevsky",
        description: "A spiritual and philosophical novel exploring morality, free will, and faith through family drama.",
        image: "/assets/the_brothers_karamazov.jpeg",
        price: 17.5,
        categoryId: categoryMap["Philosophical Fiction"],
      },
      {
        title: "War and Peace",
        author: "Leo Tolstoy",
        description: "An epic tale blending love, war, and history during the Napoleonic invasion of Russia.",
        image: "/assets/war_and_peace.jpeg",
        price: 18.99,
        categoryId: categoryMap["Historical Fiction"],
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        description: "A coming-of-age novel capturing teenage rebellion and alienation in post-war America.",
        image: "/assets/the_catcher_in_the_rye.jpeg",
        price: 13.99,
        categoryId: categoryMap["Coming-of-Age"],
      },
      {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        description: "An epic fantasy adventure about friendship, power, and the fight between good and evil.",
        image: "/assets/the_lord_of_the_rings.jpeg",
        price: 22.0,
        categoryId: categoryMap["Fantasy"],
      },
    ]);
    

    console.log("Books seeded successfully.");
  } catch (err) {
    console.error(" Seeding books failed:", err);
  }
}




seedBooks().catch((err) => {
  console.error(" Seeding books failed:", err);
});

