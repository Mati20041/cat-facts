import express from 'express';
import userRouter from './modules/authorization/router';

const rootRouter = express.Router();

rootRouter.use('/users', userRouter);

export default rootRouter;
