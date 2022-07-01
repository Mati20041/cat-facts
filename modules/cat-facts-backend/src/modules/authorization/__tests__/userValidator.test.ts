import { UserDto } from '@cat-facts/shared';
import { ReadonlyContext } from 'express-validator/src/context';
import { createRequest } from 'node-mocks-http';
import { userValidator } from '../userValidator';

const NEW_USER: UserDto = {
  username: 'User',
  password: 'Pass',
};

// This type for some reason is not exported from express-validator
type CustomResult = { readonly context: ReadonlyContext };

function extractErrorMessages(result: CustomResult[]) {
  return result.flatMap((ctx) => ctx.context.errors.map((error) => error.msg));
}

describe('userValidator', () => {
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
