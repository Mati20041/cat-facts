import express from 'express';
import { jwtAuthentication } from '../authorization/passport';
import { asyncHandler } from '../../utils/asyncHandler';
import { catFactsService } from './CatFactsService';

const router = express.Router();

router.get(
  '/fetch_data',
  jwtAuthentication,
  asyncHandler(async (_, response) => {
    const facts = await catFactsService.getFacts();
    response.send(facts);
  })
);
export default router;
