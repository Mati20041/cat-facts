import { UniqueConstraintError } from 'sequelize';
import { User } from './model';

export interface UserEntity {
  id?: number;
  username: string;
  hash: string;
}

export class UsernameNotUniqueError extends Error {
  constructor(public readonly username: string) {
    super();
  }
}

export interface UserRepository {
  createUser(userEntity: UserEntity): Promise<void>;

  findUserByName(name: string): Promise<UserEntity | null>;
}

export class ORMUserRepository implements UserRepository {
  async createUser(userEntity: UserEntity) {
    try {
      await User.create({ hash: userEntity.hash, username: userEntity.username });
    } catch (error) {
      if (
        error instanceof UniqueConstraintError &&
        error.errors.some(({ path }) => path === 'username')
      ) {
        throw new UsernameNotUniqueError(userEntity.username);
      }
      throw error;
    }
  }

  async findUserByName(name: string): Promise<UserEntity | null> {
    const foundUser = await User.findOne({ where: { username: name } });
    if (foundUser) {
      return { id: foundUser.id, username: foundUser.username, hash: foundUser.hash };
    }
    return null;
  }
}

export const userRepository = new ORMUserRepository();
