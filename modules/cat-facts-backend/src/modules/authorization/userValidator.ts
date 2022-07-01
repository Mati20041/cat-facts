import { checkSchema } from 'express-validator';

export const userValidator = checkSchema({
  username: {
    notEmpty: {
      errorMessage: 'username cannot be empty',
    },
    isLength: {
      options: {
        min: 2,
        max: 30,
      },
      errorMessage: 'username length must be between 2 and 30 characters',
    },
    trim: {},
  },
  password: {
    notEmpty: {
      errorMessage: 'password cannot be empty',
    },
    isLength: {
      options: {
        min: 2,
        max: 30,
      },
      errorMessage: 'password length must be between 2 and 30 characters',
    },
    trim: {},
  },
});
