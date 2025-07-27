import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user; // user: { id, email, roleId }
    next();
  });
};
