import sequelize from './config/db.js';
import { user, role, book, bookCategory, review } from './models/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync({ alter: true });
    // use { force: true } only for dev (drops and recreates tables each run)
    console.log('All models were synchronized successfully.');

    process.exit();
  } catch (error) {
    console.error('Unable to sync database:', error);
    process.exit(1);
  }
})();
