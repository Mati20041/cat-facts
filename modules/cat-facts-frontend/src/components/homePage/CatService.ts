import { AxiosInstance } from 'axios';
import { axiosInstance } from '../../axios/axiosInstance';

export interface CatFactDto {
  _id: string;
  user: string;
  source: string;
  type: string;
  updatedAt: string;
  createdAt: string;
  deleted: boolean;
  used: boolean;
  text: string;
  status: {
    verified: boolean;
    setCount: number;
  };
}

export class CatService {
  constructor(private client: AxiosInstance) {}

  async fetchCatData() {
    const { data } = await this.client.get<CatFactDto[]>('/users/fetch_data');
    return data;
  }
}

export const catService = new CatService(axiosInstance);
