import argon2 from 'argon2';
import { AuthorizationService, UsernameBadCredentialsError } from '../AuthorizationService';
import { UserRepository } from '../../user/UserRepository';
import { AllowedTokenRepository } from '../AllowedTokenRepository';

const USER_DTO = { username: 'TestUser', password: 'TestPassword' };

const userRepository: UserRepository = {
  findUserByName: jest.fn(),
  createUser: jest.fn(),
};
const tokenRepository: AllowedTokenRepository = {
  addAllowedToken: jest.fn(),
  isTokenAllowed: jest.fn(),
  revokeToken: jest.fn(),
};

describe('AuthorizationService', () => {
  let authorizationService: AuthorizationService;

  beforeEach(() => {
    jest.restoreAllMocks();

    authorizationService = new AuthorizationService(userRepository, tokenRepository);
  });

  describe('User creation', () => {
    it('should create a user in repository', async () => {
      // Arrange & Act
      await authorizationService.createUser(USER_DTO);
      // Assert
      expect(userRepository.createUser).toHaveBeenCalledWith({
        username: USER_DTO.username,
        hash: expect.any(String),
      });
    });
  });

  describe('User singing', () => {
    it("fails on signing when user doesn't exist", async () => {
      // Arrange
      (userRepository.findUserByName as jest.Mock).mockResolvedValue(null);
      // Act & assert
      await expect(authorizationService.signin(USER_DTO)).rejects.toThrowError(
        UsernameBadCredentialsError
      );
    });

    it('fails on signing when password is incorrect', async () => {
      // Arrange
      (userRepository.findUserByName as jest.Mock).mockResolvedValue({
        id: 1,
        username: USER_DTO.username,
        hash: await argon2.hash('ANOTHER_PASSWORD'),
      });
      // Act & assert
      await expect(authorizationService.signin(USER_DTO)).rejects.toThrowError(
        UsernameBadCredentialsError
      );
    });

    it('should return an access token', async () => {
      // Arrange
      (userRepository.findUserByName as jest.Mock).mockResolvedValue({
        id: 1,
        username: USER_DTO.username,
        hash: await argon2.hash(USER_DTO.password),
      });
      // Act
      const accessToken = await authorizationService.signin(USER_DTO);
      // Assert
      expect(accessToken.access_token).toBeTruthy();
      expect(tokenRepository.addAllowedToken).toHaveBeenCalledWith(accessToken.access_token);
    });
  });
});
