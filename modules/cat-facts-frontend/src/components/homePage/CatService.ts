import { AxiosInstance } from 'axios';
import { CatFactDto } from '@cat-facts/shared';
import { axiosInstance } from '../../axios/axiosInstance';
import { apiRoutes } from '../../apiRouting';

export class CatService {
  constructor(private client: AxiosInstance) {}

  async fetchCatData() {
    const { data } = await this.client.get<CatFactDto[]>(apiRoutes.fetchData);
    return data;
  }
}

export const catService = new CatService(axiosInstance);
