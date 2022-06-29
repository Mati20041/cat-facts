import createError, { HttpError, isHttpError } from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import './models';
import './modules/authorization/passport';
import rootRouter from './rootRouter';

const app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(rootRouter);

// catch 404 and forward to error handler
app.use((_request, _response, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: HttpError | Error, request: Request, response: Response, _next: NextFunction) => {
  if (isHttpError(error)) {
    response.status(error.status).send({ error: error.message });
  } else {
    console.error(error);
    response.status(500).send({ error: error.message || 'Internal Server Error' });
  }
});

export default app;
