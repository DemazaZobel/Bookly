import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const BookCategory = sequelize.define('BookCategory', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100],
    },
  },
}, {
  tableName: 'book_categories',

});

export default BookCategory;
