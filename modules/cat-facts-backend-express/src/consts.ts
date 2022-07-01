/* eslint-disable prefer-destructuring */
if (!process.env.SECRET) {
  throw new Error('No SECRET environment variable');
}
export const SECRET = process.env.SECRET;
export const TOKEN_TTL: string = process.env.TOKEN_TTL ?? '15m';
