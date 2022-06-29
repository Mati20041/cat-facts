import React, { useContext, useMemo, useState } from 'react';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { axiosInstance } from '../axios/axiosInstance';

export interface User {
  username: string;
  token: string;
}

export interface UserDto {
  username: string;
  password: string;
}

const addAuthorizationHeader = (token: string) => (config: AxiosRequestConfig) => {
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
  return config;
};

export class AuthenticationService {
  private previousInterceptorId: number | undefined;

  constructor(private client: AxiosInstance, private setUser: (user: User) => void) {}

  signup(user: UserDto) {
    return this.client.post('/users/new', user);
  }

  async signin(user: UserDto) {
    const { data } = await this.client.post<{ access_token: string }>('/users/login', user);
    const decoded = jwtDecode<JwtPayload>(data.access_token);
    const username = decoded.sub ?? 'N/A';
    this.registerAuthInClient(data.access_token);
    this.setUser({ username, token: data.access_token });
  }

  private registerAuthInClient(accessToken: string) {
    if (this.previousInterceptorId) {
      axiosInstance.interceptors.request.eject(this.previousInterceptorId);
    }
    this.previousInterceptorId = axiosInstance.interceptors.request.use(
      addAuthorizationHeader(accessToken)
    );
  }

  // In the future logout
}

const UserContext = React.createContext<{
  user: User | undefined;
  authenticationService: AuthenticationService;
}>({
  user: undefined,
  authenticationService: new AuthenticationService(axiosInstance, () => {}),
});

export const AuthenticationProvider: React.FC<{
  children: React.ReactElement[] | React.ReactElement;
}> = ({ children }) => {
  // This could be stored in a local storage or in a cookie for refreshing site.
  // For the simplicity of "reload to log in again" this was left for now
  const [user, setUser] = useState<User>();
  const value = useMemo(
    () => ({
      user,
      authenticationService: new AuthenticationService(axiosInstance, setUser),
    }),
    [user]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAuthentication = () => {
  return useContext(UserContext);
};
