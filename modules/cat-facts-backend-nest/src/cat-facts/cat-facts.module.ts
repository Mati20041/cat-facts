import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CatFactsService } from './cat-facts.service';
import { CatFactsController } from './cat-facts.controller';

@Module({
  imports: [HttpModule],
  providers: [CatFactsService],
  controllers: [CatFactsController],
})
export class CatFactsModule {}
