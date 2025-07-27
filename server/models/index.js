import book from './book.js';
import bookCategory from './bookCategory.js';
import review from './review.js';
import role from './role.js';
import user from './user.js';
import sequelize from '../config/db.js';

// === User & Role ===
user.belongsTo(role, {
  foreignKey: 'roleId',
  allowNull: false,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
role.hasMany(user, { foreignKey: 'roleId' });

// === Book & BookCategory ===
book.belongsTo(bookCategory, {
  foreignKey: 'categoryId',
  allowNull: true,
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});
bookCategory.hasMany(book, { foreignKey: 'categoryId' });

// === Review & User ===
review.belongsTo(user, {
  foreignKey: 'userId',
  allowNull: false,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
user.hasMany(review, { foreignKey: 'userId' });

// === Review & Book ===
review.belongsTo(book, {
  foreignKey: 'bookId',
  allowNull: false,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
book.hasMany(review, { foreignKey: 'bookId' });

export { user, role, book, bookCategory, review, sequelize };




/* | Relationship                | Sequelize method               |
| --------------------------- | ------------------------------ |
| User belongs to Role        | `User.belongsTo(Role)`         |
| Role has many Users         | `Role.hasMany(User)`           |
| Book belongs to Category    | `Book.belongsTo(BookCategory)` |
| BookCategory has many Books | `BookCategory.hasMany(Book)`   |
| Review belongs to User      | `Review.belongsTo(User)`       |
| Review belongs to Book      | `Review.belongsTo(Book)`       |
| Book has many Reviews       | `Book.hasMany(Review)`         |
*/