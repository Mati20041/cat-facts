/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import catRouter from '../router';
import { catFactsService } from '../CatFactsService';
import { allowedTokenRepository } from '../../authorization/AllowedTokenRepository';

const SECRET = 'SECRET';

jest.mock('../../authorization/AllowedTokenRepository', () => ({
  allowedTokenRepository: {
    isTokenAllowed: jest.fn(),
  },
}));

jest.mock('../../../consts', () => ({
  SECRET: 'SECRET',
}));

jest.mock('../CatFactsService', () => ({
  catFactsService: {
    getFacts: jest.fn(),
  },
}));

const catchError = jest.fn();

const app = express();
app.use(catRouter);
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  catchError(err);
  res.status(500).send('error');
});

const CAT_FACTS = [{ text: 'hello' }];

const FETCH_URL = '/fetch_data';
describe('CatFactsRoute', () => {
  beforeEach(() => {});
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return cat facts', async () => {
    // Arrange
    (catFactsService.getFacts as jest.Mock).mockResolvedValue(CAT_FACTS);
    (allowedTokenRepository.isTokenAllowed as jest.Mock).mockResolvedValue(true);
    const token = sign({}, SECRET);

    // Act & Assert
    await request(app).get(FETCH_URL).auth(token, { type: 'bearer' }).expect(200).expect(CAT_FACTS);
  });

  describe('Error', () => {
    it('should fail when fetching cannot be completed', async () => {
      // Arrange
      const error = new Error('oh noes');
      (catFactsService.getFacts as jest.Mock).mockRejectedValue(error);
      (allowedTokenRepository.isTokenAllowed as jest.Mock).mockResolvedValue(true);
      const token = sign({}, SECRET);

      // Act & Assert
      await request(app).get(FETCH_URL).auth(token, { type: 'bearer' }).expect(500);
      expect(catchError).toHaveBeenCalledWith(error);
    });
  });

  describe('UNAUTHORIZED', () => {
    it('should return UNAUTHORIZED work if token is not allowed', async () => {
      // Arrange
      (catFactsService.getFacts as jest.Mock).mockResolvedValue(CAT_FACTS);
      (allowedTokenRepository.isTokenAllowed as jest.Mock).mockResolvedValue(false);
      const token = sign({}, SECRET);

      // Act & Assert
      await request(app).get(FETCH_URL).auth(token, { type: 'bearer' }).expect(401);
    });

    it('should return UNAUTHORIZED work if token is not valid', async () => {
      // Arrange
      (catFactsService.getFacts as jest.Mock).mockResolvedValue(CAT_FACTS);
      (allowedTokenRepository.isTokenAllowed as jest.Mock).mockResolvedValue(true);
      const token = sign({}, 'OTHER_SECRET');

      // Act & Assert
      await request(app).get(FETCH_URL).auth(token, { type: 'bearer' }).expect(401);
    });

    it('should return UNAUTHORIZED work if token is not present', async () => {
      // Arrange
      (catFactsService.getFacts as jest.Mock).mockResolvedValue(CAT_FACTS);
      (allowedTokenRepository.isTokenAllowed as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await request(app).get(FETCH_URL).expect(401);
    });
  });
});
