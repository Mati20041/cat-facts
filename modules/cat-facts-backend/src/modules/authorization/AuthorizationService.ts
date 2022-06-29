import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
  UserEntity,
  UsernameNotUniqueError,
  userRepository,
  UserRepository,
} from "../user/UserRepository";
import { HttpBaseError } from "../../utils/error";
import { AllowedTokenRepository, allowedTokenRepository } from "./AllowedTokenRepository";
import { UserDto } from "./dto";

export class UsernameBadCredentialsError extends HttpBaseError(401, "Bad credentials") {}

export class UsernameAlreadyExistsError extends HttpBaseError(409, "Username already exists") {}

export class AuthorizationService {
  constructor(
    private userRepository: UserRepository,
    private allowedJWTRepository: AllowedTokenRepository
  ) {}

  async createUser(user: UserDto) {
    const hash = await argon2.hash(user.password);
    try {
      await this.userRepository.createUser({ username: user.username, hash });
    } catch (error) {
      if (error instanceof UsernameNotUniqueError) {
        throw new UsernameAlreadyExistsError();
      }
      throw error;
    }
  }

  async signin(user: UserDto) {
    const foundUser = await this.userRepository.findUserByName(user.username);
    if (!foundUser) {
      throw new UsernameBadCredentialsError();
    }
    const validPassword = await argon2.verify(foundUser.hash, user.password);
    if (!validPassword) {
      throw new UsernameBadCredentialsError();
    }
    const accessToken = generateAccessToken(foundUser);
    await this.allowedJWTRepository.addAllowedToken(accessToken);
    return { access_token: accessToken };
  }
}

function generateAccessToken(foundUser: UserEntity) {
  return jwt.sign({ sub: foundUser.username }, "SECRET", { expiresIn: "15m" });
}

export const authorizationService = new AuthorizationService(
  userRepository,
  allowedTokenRepository
);
