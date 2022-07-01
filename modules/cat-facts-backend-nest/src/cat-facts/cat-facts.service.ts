import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CatFactDto } from '@cat-facts/shared';
import { ConfigService } from '@nestjs/config';

export const CAT_FACTS_URL = 'https://cat-fact.herokuapp.com/facts';

@Injectable()
export class CatFactsService {
  private readonly catFactsUrl: string;

  constructor(configService: ConfigService) {
    this.catFactsUrl = configService.getOrThrow('CAT_FACTS_URL');
  }

  async getFacts() {
    const { data } = await axios.get<CatFactDto[]>(this.catFactsUrl);
    return data;
  }
}
