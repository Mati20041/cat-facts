/* eslint-disable @typescript-eslint/return-await */
import { ForbiddenException, Injectable, ConflictException } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          username: dto.username,
          hash,
        },
      });
      return await this.signToken(user.id, user.username);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email not unique');
      }
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: dto.username,
      },
    });
    if (!user) {
      throw new ForbiddenException('Credential Incorrect');
    }
    const pwMatcher = await argon.verify(user.hash, dto.password);

    if (!pwMatcher) {
      throw new ForbiddenException('Credential Incorrect');
    }
    return await this.signToken(user.id, dto.username);
  }

  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('TOKEN_TTL'),
        secret: this.configService.get('JWT_SECRET'),
      }),
    };
  }
}
