import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id',
    },
    validate: {
      notEmpty: true,
    },
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'books', // table name
      key: 'id',
    },
    validate: {
      notEmpty: true,
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000],
    },
  },
}, {
  tableName: 'reviews',
  timestamps: false,
});

export default Review;
