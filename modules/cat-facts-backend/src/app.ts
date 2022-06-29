import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import './models';
import './modules/authorization/passport';
import rootRouter from './rootRouter';
import { mainErrorHandler } from './mainErrorHandler';

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
app.use(mainErrorHandler);

export default app;
