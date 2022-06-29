import { UniqueConstraintError, ValidationErrorItem } from 'sequelize';
import { UserEntity, UsernameNotUniqueError, userRepository } from '../UserRepository';
import { User } from '../model';

const USER_ENTITY: UserEntity = { username: 'user', hash: 'hash' };

jest.mock('../model', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

describe('UserRepository', () => {
  describe('user creation', () => {
    it('should create a user', async () => {
      // Arrange & Act
      await userRepository.createUser(USER_ENTITY);

      // Assert
      expect(User.create).toHaveBeenCalledWith({
        username: USER_ENTITY.username,
        hash: USER_ENTITY.hash,
      });
    });

    it('throws UsernameNotUniqueError when UniqueConstraintError is thrown', async () => {
      // Arrange
      (User.create as jest.Mock).mockRejectedValue(
        new UniqueConstraintError({ errors: [{ path: 'username' } as ValidationErrorItem] })
      );
      // Act
      await expect(userRepository.createUser(USER_ENTITY)).rejects.toThrow(UsernameNotUniqueError);

      // Assert
      expect(User.create).toHaveBeenCalledWith({
        username: USER_ENTITY.username,
        hash: USER_ENTITY.hash,
      });
    });

    it('throws same error if unknown error was thrown', async () => {
      // Arrange
      (User.create as jest.Mock).mockRejectedValue(new Error('not ok'));
      // Act
      await expect(userRepository.createUser(USER_ENTITY)).rejects.toThrow(Error);

      // Assert
      expect(User.create).toHaveBeenCalledWith({
        username: USER_ENTITY.username,
        hash: USER_ENTITY.hash,
      });
    });
  });

  describe('user finding', () => {
    it('should find user', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockReturnValue({
        hash: USER_ENTITY.hash,
        username: USER_ENTITY.username,
      });

      // Act
      const foundUser = await userRepository.findUserByName(USER_ENTITY.username);

      // Assert
      expect(foundUser).toEqual({ ...USER_ENTITY, id: undefined });
    });

    it('should find user', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockReturnValue(null);

      // Act
      const foundUser = await userRepository.findUserByName(USER_ENTITY.username);

      // Assert
      expect(foundUser).toBeNull();
    });
  });
});
