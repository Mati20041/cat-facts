import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export const validatorMiddleware: RequestHandler = (request, response, next) => {
  const validationErrors = validationResult(request);
  if (validationErrors.isEmpty()) {
    next();
  } else {
    response.status(StatusCodes.BAD_REQUEST).send({ errors: validationErrors.array() });
  }
};
