/* eslint-disable no-console */
import { sequelize } from './sequelize/init';

export const initResources = async () => {
  await sequelize.sync();
};

export const destroyResources = async () => {
  try {
    await sequelize.close();
    console.log('ORM disconnected from database');
  } catch (error) {
    console.error('Error disconnecting from database', error);
  }
};
