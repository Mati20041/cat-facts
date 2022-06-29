import axios from 'axios';
import { CatFactDto } from '@cat-facts/shared';

export const CAT_FACTS_URL = 'https://cat-fact.herokuapp.com/facts';

export class CatFactsService {
  async getFacts() {
    const { data } = await axios.get<CatFactDto[]>(CAT_FACTS_URL);
    return data;
  }
}

export const catFactsService = new CatFactsService();
