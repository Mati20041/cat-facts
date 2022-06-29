/* eslint-disable @typescript-eslint/no-unused-vars,unicorn/consistent-function-scoping */
import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../asyncHandler';

const sendMock = jest.fn();
const nextMock = jest.fn();
const request = {} as Request;
const response = {
  send: sendMock,
} as unknown as Response;

describe('asyncHandler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("it doesn't add any behaviour when no error", async () => {
    // Arrange
    const handler = async (request: Request, response: Response, _next: NextFunction) => {
      response.send('ok');
    };
    // Act
    await asyncHandler(handler)(request, response, nextMock);
    // Assert
    expect(sendMock).toHaveBeenCalledWith('ok');
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('calls next with an error', async () => {
    // Arrange
    const error = new Error('oh noes');
    const handler = async (_request: Request, _response: Response, _next: NextFunction) => {
      throw error;
    };
    // Act
    await asyncHandler(handler)(request, response, nextMock);
    // Assert
    expect(sendMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledWith(error);
  });
});
