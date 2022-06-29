/* eslint-disable @typescript-eslint/require-await */

/*
 This is just a proof of concept for whitelisting tokens that are allowed to be consumed
 This is important while using JWT tokens to restrict logged-out/banned users from using the system.
 This usually should be implemented by a high-performance cache like redis for application
 to be able to scale.
 For the sake of simplicity this is just inmemory implementation. Application won't work with multiple
 instances with the current state.
*/

export interface AllowedTokenRepository {
  addAllowedToken(jwt: string): Promise<void>;

  isTokenAllowed(jwt: string): Promise<boolean>;

  revokeToken(jwt: string): Promise<void>;
}

export class InMemoryAllowedTokenRepository implements AllowedTokenRepository {
  private allowSet = new Set<string>();

  async addAllowedToken(jwt: string) {
    this.allowSet.add(jwt);
  }

  async isTokenAllowed(jwt: string) {
    return this.allowSet.has(jwt);
  }

  async revokeToken(jwt: string) {
    this.allowSet.delete(jwt);
  }
}

export const allowedTokenRepository = new InMemoryAllowedTokenRepository();
