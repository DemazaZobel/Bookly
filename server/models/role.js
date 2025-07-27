import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true, 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50],
    },
  },
}, {
  tableName: 'roles',
});

export default Role;
