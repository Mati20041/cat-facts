/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-unsafe-member-access */
import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import { decode } from 'jsonwebtoken';
import { UserDto } from '@cat-facts/shared';
import { ReadonlyContext } from 'express-validator/src/context';
import { createRequest } from 'node-mocks-http';
import argon2 from 'argon2';
import { StatusCodes } from 'http-status-codes';
import { UsernameAlreadyExistsError } from '../AuthorizationService';
import { UsernameNotUniqueError, userRepository } from '../../user/UserRepository';
import authorizationRouter, { userValidator } from '../router';
import { mainErrorHandler } from '../../../mainErrorHandler';

jest.mock('../../../consts', () => ({
  SECRET: 'SECRET',
  TOKEN_TTL: '15m',
}));

jest.mock('../../user/UserRepository', () => ({
  ...jest.requireActual('../../user/UserRepository'),
  userRepository: {
    findUserByName: jest.fn(),
    createUser: jest.fn(),
  },
}));

const catchError = jest.fn();

const app = express();
app.use(express.json());
app.use(authorizationRouter);
app.use((err: Error, _req: Request, _res: Response, next: NextFunction) => {
  catchError(err);
  next(err);
});
app.use(mainErrorHandler);

const CREATE_USER = '/new';
const LOGIN_USER = '/login';

const NEW_USER: UserDto = {
  username: 'User',
  password: 'Pass',
};

// This type for some reason is not exported from express-validator
type CustomResult = { readonly context: ReadonlyContext };

function extractErrorMessages(result: CustomResult[]) {
  return result.flatMap((ctx) => ctx.context.errors.map((error) => error.msg));
}

describe('AuthorizationRoute', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('user creation', () => {
    it('should create a user', async () => {
      // Arrange & Act & Assert
      await request(app).post(CREATE_USER).send(NEW_USER).expect(StatusCodes.CREATED);
      expect(userRepository.createUser).toHaveBeenCalledWith({
        username: NEW_USER.username,
        hash: expect.any(String),
      });
    });

    it('fails not unique username from repository ', async () => {
      // Arrange
      (userRepository.createUser as jest.Mock).mockRejectedValue(
        new UsernameNotUniqueError(NEW_USER.username)
      );
      // Act & Assert
      await request(app).post(CREATE_USER).send(NEW_USER).expect(StatusCodes.CONFLICT);
      expect(catchError).toHaveBeenCalledWith(new UsernameAlreadyExistsError());
    });

    it('should pass error if it is not UsernameNotUniqueError', async () => {
      // Arrange
      const error = new Error('oh noes');
      (userRepository.createUser as jest.Mock).mockRejectedValue(error);
      // Act & Assert
      await request(app).post(CREATE_USER).send(NEW_USER).expect(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(catchError).toHaveBeenCalledWith(error);
    });
  });

  describe('user signin', () => {
    it('should signin the user', async () => {
      // Arrange
      (userRepository.findUserByName as jest.Mock).mockResolvedValue({
        id: 1,
        username: NEW_USER.username,
        hash: await argon2.hash(NEW_USER.password),
      });

      // Act & Assert
      await request(app)
        .post(LOGIN_USER)
        .send(NEW_USER)
        .expect(StatusCodes.OK)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          const data = decode(res.body.access_token);
          expect(data).toHaveProperty('sub', NEW_USER.username);
        });
    });

    it('should return UNATHORIZED when user is not in repository', async () => {
      // Arrange
      (userRepository.findUserByName as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await request(app).post(LOGIN_USER).send(NEW_USER).expect(StatusCodes.UNAUTHORIZED);
    });

    it('should return UNATHORIZED when password is not correct', async () => {
      // Arrange
      (userRepository.findUserByName as jest.Mock).mockResolvedValue({
        id: 1,
        username: NEW_USER.username,
        hash: await argon2.hash('ANOTHER_PASSWORD'),
      });

      // Act & Assert
      await request(app).post(LOGIN_USER).send(NEW_USER).expect(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('Validation', () => {
    describe('route validation', () => {
      it('should return BAD_REQUEST on creating wrong user', async () => {
        // Arrange
        const user: UserDto = {
          username: '',
          password: 'Pass',
        };

        // Act & Assert
        await request(app).post(CREATE_USER).send(user).expect(StatusCodes.BAD_REQUEST);
      });

      it('should return BAD_REQUEST on signin wrong user', async () => {
        // Arrange
        const user: UserDto = {
          username: '',
          password: 'Pass',
        };

        // Act & Assert
        await request(app).post(LOGIN_USER).type('json').send(user).expect(StatusCodes.BAD_REQUEST);
      });
    });

    describe('middleware validation', () => {
      it('should validate correctly', async () => {
        // Arrange & Act
        const result = await userValidator.run(
          createRequest({
            body: NEW_USER,
          })
        );

        // Assert
        expect(extractErrorMessages(result)).toEqual([]);
      });

      it('fails on user without a username', async () => {
        // Arrange
        const user: UserDto = {
          username: '',
          password: 'Pass',
        };

        // Act
        const result = await userValidator.run(
          createRequest({
            body: user,
          })
        );

        // Assert
        expect(extractErrorMessages(result)).toEqual([
          'username cannot be empty',
          'username length must be between 2 and 30 characters',
        ]);
      });

      it('fails on user without a password', async () => {
        // Arrange
        const user: UserDto = {
          username: 'User',
          password: '',
        };

        // Act
        const result = await userValidator.run(
          createRequest({
            body: user,
          })
        );

        // Assert
        expect(extractErrorMessages(result)).toEqual([
          'password cannot be empty',
          'password length must be between 2 and 30 characters',
        ]);
      });

      it('fails on user with too short username', async () => {
        // Arrange
        const user: UserDto = {
          username: 'U',
          password: 'Pass',
        };

        // Act
        const result = await userValidator.run(
          createRequest({
            body: user,
          })
        );

        // Assert
        expect(extractErrorMessages(result)).toEqual([
          'username length must be between 2 and 30 characters',
        ]);
      });

      it('fails on user with too long username', async () => {
        // Arrange
        const user: UserDto = {
          username: 'a'.repeat(31),
          password: 'Pass',
        };

        // Act
        const result = await userValidator.run(
          createRequest({
            body: user,
          })
        );

        // Assert
        expect(extractErrorMessages(result)).toEqual([
          'username length must be between 2 and 30 characters',
        ]);
      });

      it('fails on user with too short password', async () => {
        // Arrange
        const user: UserDto = {
          username: 'User',
          password: 'P',
        };

        // Act
        const result = await userValidator.run(
          createRequest({
            body: user,
          })
        );

        // Assert
        expect(extractErrorMessages(result)).toEqual([
          'password length must be between 2 and 30 characters',
        ]);
      });

      it('fails on user with too long password', async () => {
        // Arrange
        const user: UserDto = {
          username: 'User',
          password: 'P'.repeat(31),
        };

        // Act
        const result = await userValidator.run(
          createRequest({
            body: user,
          })
        );

        // Assert
        expect(extractErrorMessages(result)).toEqual([
          'password length must be between 2 and 30 characters',
        ]);
      });
    });
  });
});
