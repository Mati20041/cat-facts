import { ValidationError } from 'yup';
import { UserDto } from '@cat-facts/shared';
import { userDtoSchema } from '../validation';

describe('validation', () => {
  it('should show NotLoggedUser information', async () => {
    // Arrange
    const goodUser: UserDto = {
      username: 'User',
      password: 'Pass',
    };
    // Act
    const results = await userDtoSchema.validate(goodUser);

    // Assert
    expect(results).toEqual(goodUser);
  });

  it('fails on user without a username', async () => {
    // Arrange
    const user: UserDto = {
      username: '',
      password: 'Pass',
    };
    // Act & Assert
    await expect(userDtoSchema.validate(user)).rejects.toThrow(ValidationError);
  });

  it('fails on user without a password', async () => {
    // Arrange
    const user: UserDto = {
      username: 'User',
      password: '',
    };
    // Act & Assert
    await expect(userDtoSchema.validate(user)).rejects.toThrow(ValidationError);
  });

  it('fails on user with too short username', async () => {
    // Arrange
    const user: UserDto = {
      username: 'U',
      password: 'Pass',
    };
    // Act & Assert
    await expect(userDtoSchema.validate(user)).rejects.toThrow(ValidationError);
  });

  it('fails on user with too long username', async () => {
    // Arrange
    const user: UserDto = {
      username: 'a'.repeat(31),
      password: 'Pass',
    };
    // Act & Assert
    await expect(userDtoSchema.validate(user)).rejects.toThrow(ValidationError);
  });

  it('fails on user with too short password', async () => {
    // Arrange
    const user: UserDto = {
      username: 'User',
      password: 'P',
    };
    // Act & Assert
    await expect(userDtoSchema.validate(user)).rejects.toThrow(ValidationError);
  });

  it('fails on user with too long password', async () => {
    // Arrange
    const user: UserDto = {
      username: 'User',
      password: 'P'.repeat(31),
    };
    // Act & Assert
    await expect(userDtoSchema.validate(user)).rejects.toThrow(ValidationError);
  });
});
