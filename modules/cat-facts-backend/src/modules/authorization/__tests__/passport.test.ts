import { Request } from "express";
import { verify } from "../passport";
import { allowedTokenRepository } from "../AllowedTokenRepository";
import { ExtractJwt } from "passport-jwt";

jest.mock("passport-jwt", () => ({
  ...jest.requireActual("passport-jwt"),
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue(jest.fn()),
  },
}));

jest.mock("../AllowedTokenRepository", () => ({
  allowedTokenRepository: {
    isTokenAllowed: jest.fn(),
  },
}));

const extractor = ExtractJwt.fromAuthHeaderAsBearerToken() as jest.Mock;
describe("passport", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("verify", () => {
    it("should not verify if token is not extracted from a request", () => {
      // Arrange
      extractor.mockReturnValue(null);
      const doneMock = jest.fn();
      // Act
      verify({} as Request, {}, doneMock);

      // Assert
      expect(doneMock).toHaveBeenCalledWith(null, false);
    });

    it("should not verify if token is not allowed", async () => {
      // Arrange
      extractor.mockReturnValue("token");
      (allowedTokenRepository.isTokenAllowed as jest.Mock).mockResolvedValue(false);
      const doneMock = jest.fn();
      const lock = new Promise((resolve) => {
        doneMock.mockImplementation(() => resolve(""));

        // Act
        verify({} as Request, {}, doneMock);
      });
      await lock;

      // Assert
      expect(doneMock).toHaveBeenCalledWith(null, false);
    });

    it("should verify if token is present and allowed", async () => {
      // Arrange
      extractor.mockReturnValue("token");
      (allowedTokenRepository.isTokenAllowed as jest.Mock).mockResolvedValue(true);
      const doneMock = jest.fn();
      const payload = { sub: "user" };
      const lock = new Promise((resolve) => {
        doneMock.mockImplementation(() => resolve(""));

        // Act
        verify({} as Request, payload, doneMock);
      });
      await lock;
      // Assert
      expect(doneMock).toHaveBeenCalledWith(null, payload);
    });
  });
});
