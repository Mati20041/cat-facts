import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { validatorMiddleware } from "../validatorMiddleware";

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

describe("validatorMiddleware", () => {
  it("should proceed to next middleware when validationErrors are empty", async () => {
    // Arrange
    const isEmptyMock = jest.fn().mockReturnValue(true);
    (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: isEmptyMock });

    const doneMock = jest.fn();
    await new Promise((resolve) => {
      doneMock.mockImplementation(resolve);
      // Act
      validatorMiddleware({} as Request, {} as Response, doneMock);
    });

    // Assert
    expect(doneMock).toHaveBeenCalled();
  });
  it("should response with errors when validationErrors are present", async () => {
    // Arrange
    const isEmptyMock = jest.fn().mockReturnValue(false);
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: isEmptyMock,
      array: () => ["error"],
    });

    const statusMock = jest.fn();
    const sendMock = jest.fn();
    await new Promise((resolve) => {
      statusMock.mockImplementation(() => ({
        send: sendMock.mockImplementation(resolve),
      }));
      // Act
      validatorMiddleware(
        {} as Request,
        { status: statusMock, send: jest.fn() } as unknown as Response,
        jest.fn()
      );
    });

    // Assert
    expect(statusMock).toHaveBeenCalled();
    expect(sendMock).toHaveBeenCalled();
  });
});
