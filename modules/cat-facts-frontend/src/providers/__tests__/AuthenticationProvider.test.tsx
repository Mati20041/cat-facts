import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthenticationProvider, useAuthentication, UserDto } from '../AuthenticationProvider';
import { axiosInstance } from '../../axios/axiosInstance';
import userEvent from '@testing-library/user-event';
import { sign } from 'jsonwebtoken';

jest.mock('../../axios/axiosInstance', () => ({
  axiosInstance: {
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
    post: jest.fn(),
  },
}));

const USER_DTO: UserDto = {
  username: 'username',
  password: 'password',
};

describe('AuthenticationProvider', () => {
  it('should render correctly', () => {
    // Arrange & Act
    const { signinButton, signupButton } = renderAuthenticationProvider();

    // Assert
    expect(screen.getByText('NO-USER')).toBeInTheDocument();
    expect(signinButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });

  it('should signup', () => {
    // Arrange
    const { signupButton } = renderAuthenticationProvider();

    // Act
    userEvent.click(signupButton);

    // Assert
    expect(axiosInstance.post).toHaveBeenCalledWith('/users/new', USER_DTO);
  });

  it('should signin', async () => {
    // Arrange
    const jwtToken = sign({ sub: 'Username' }, 'SECRET');
    (axiosInstance.post as jest.Mock).mockResolvedValue({ data: { access_token: jwtToken } });
    const { signinButton } = renderAuthenticationProvider();

    // Act
    userEvent.click(signinButton);

    // Assert
    expect(axiosInstance.post).toHaveBeenCalledWith('/users/login', USER_DTO);
    await waitFor(() => {
      expect(axiosInstance.interceptors.request.use).toHaveBeenCalled();
    });
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('should show N/A as username if sub is not present', async () => {
    // Arrange
    const jwtToken = sign({}, 'SECRET');
    (axiosInstance.post as jest.Mock).mockResolvedValue({ data: { access_token: jwtToken } });
    const { signinButton } = renderAuthenticationProvider();

    // Act
    userEvent.click(signinButton);

    // Assert
    expect(axiosInstance.post).toHaveBeenCalledWith('/users/login', USER_DTO);
    await waitFor(() => {
      expect(axiosInstance.interceptors.request.use).toHaveBeenCalled();
    });
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});

const TestComponent = () => {
  const { user, authenticationService } = useAuthentication();

  return (
    <div>
      <p>{user?.username ?? 'NO-USER'}</p>
      <button onClick={() => authenticationService.signin(USER_DTO)}>Signin</button>
      <button onClick={() => authenticationService.signup(USER_DTO)}>Signup</button>
    </div>
  );
};

const renderAuthenticationProvider = () => {
  render(
    <AuthenticationProvider>
      <TestComponent />
    </AuthenticationProvider>
  );
  return {
    signinButton: screen.getByRole('button', { name: 'Signin' }),
    signupButton: screen.getByRole('button', { name: 'Signup' }),
  };
};
