/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpError, isHttpError } from 'http-errors';
import { NextFunction, Request, Response } from 'express';

export const mainErrorHandler = (
  error: HttpError | Error,
  request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (isHttpError(error)) {
    response.status(error.status).send({ error: error.message });
  } else {
    console.error(error);
    response.status(500).send({ error: error.message || 'Internal Server Error' });
  }
};
