import { Request } from 'express';
import { createResponse } from 'node-mocks-http';
import { HttpBaseError } from '../utils/error';
import { mainErrorHandler } from '../mainErrorHandler';

class MyHttpError extends HttpBaseError(418, "I'm a teapod") {}

const nextMock = jest.fn();

describe('mainErrorHandler', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should send a status and an error from HttpError', () => {
    // Arrange
    const error = new MyHttpError();
    const response = createResponse();

    // Act
    mainErrorHandler(error, {} as Request, response, nextMock);

    // Assert
    expect(response._getStatusCode()).toEqual(error.status);
    expect(response._getData()).toEqual({ error: error.message });
  });

  it('should send message from an error when error is unknown', () => {
    // Arrange
    const error = new Error('oh noes');
    const response = createResponse();

    // Act
    mainErrorHandler(error, {} as Request, response, nextMock);

    // Assert
    expect(response._getStatusCode()).toEqual(500);
    expect(response._getData()).toEqual({ error: error.message });
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it('should send generic message when error is unknown and message is empty', () => {
    // Arrange
    // eslint-disable-next-line unicorn/error-message
    const error = new Error('');
    const response = createResponse();

    // Act
    mainErrorHandler(error, {} as Request, response, nextMock);

    // Assert
    expect(response._getStatusCode()).toEqual(500);
    expect(response._getData()).toEqual({ error: 'Internal Server Error' });
    expect(console.error).toHaveBeenCalledWith(error);
  });
});
