import { HttpError } from "http-errors";

export const HttpBaseError = (status: number, message: string) =>
  class extends Error implements HttpError {
    public readonly expose: boolean;
    public readonly statusCode: number;
    public readonly status: number;

    constructor() {
      super(message);
      this.expose = true;
      this.status = status;
      this.statusCode = status;
    }
  };
