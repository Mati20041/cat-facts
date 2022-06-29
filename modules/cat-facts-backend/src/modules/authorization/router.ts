import { constants } from 'node:http2';
import express from 'express';
import { checkSchema } from 'express-validator';
import { UserDto } from '@cat-facts/shared';
import catRouter from '../catFacts/router';
import { asyncHandler } from '../../utils/asyncHandler';
import { validatorMiddleware } from '../../utils/validatorMiddleware';
import { authorizationService } from './AuthorizationService';

const router = express.Router();

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

router.post(
  '/new',
  userValidator,
  validatorMiddleware,
  asyncHandler(async (request, response) => {
    const userDto: UserDto = request.body;
    await authorizationService.createUser(userDto);
    response.status(constants.HTTP_STATUS_CREATED).send('User created');
  })
);

router.post(
  '/login',
  userValidator,
  validatorMiddleware,
  asyncHandler(async (request, response) => {
    const userDto: UserDto = request.body;
    const result = await authorizationService.signin(userDto);
    response.send(result);
  })
);

router.use(catRouter);

export default router;
