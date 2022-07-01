import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatFactsModule } from './cat-facts/cat-facts.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, CatFactsModule],
})
export class AppModule {}
