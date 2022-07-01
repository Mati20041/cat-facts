import express from 'express';
import { UserDto } from '@cat-facts/shared';
import { StatusCodes } from 'http-status-codes';
import catRouter from '../catFacts/router';
import { asyncHandler } from '../../utils/asyncHandler';
import { validatorMiddleware } from '../../utils/validatorMiddleware';
import { authorizationService } from './AuthorizationService';
import { userValidator } from './userValidator';

const router = express.Router();

router.post(
  '/new',
  userValidator,
  validatorMiddleware,
  asyncHandler(async (request, response) => {
    const userDto: UserDto = request.body;
    await authorizationService.createUser(userDto);
    response.status(StatusCodes.CREATED).send('User created');
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
