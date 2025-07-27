import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255],
    },
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000],
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
   
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'book_categories', // the table name in lowercase plural
      key: 'id',
    },
    validate: {
      notEmpty: true,
    },
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 0,
    },
  },
}, {
  tableName: 'books',
  timestamps: false,
});

export default Book;
