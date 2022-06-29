import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const validatorMiddleware: RequestHandler = (request, response, next) => {
  const validationErrors = validationResult(request);
  if (validationErrors.isEmpty()) {
    next();
  } else {
    response.status(400).send({ errors: validationErrors.array() });
  }
};
