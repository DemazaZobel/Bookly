import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('BookReview', 'postgres', 'noah', {
  host: 'localhost',
  dialect: 'postgres',
});

export default sequelize;
