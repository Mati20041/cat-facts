import { Controller, Get } from '@nestjs/common';
import { CatFactsService } from './cat-facts.service';

@Controller('users')
export class CatFactsController {
  constructor(private catFactsService: CatFactsService) {}

  @Get('fetch_data')
  fetchData() {
    return this.catFactsService.getFacts();
  }
}
