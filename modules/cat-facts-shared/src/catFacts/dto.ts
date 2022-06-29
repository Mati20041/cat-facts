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
