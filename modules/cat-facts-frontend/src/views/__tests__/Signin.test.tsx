import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AxiosError, AxiosResponse } from 'axios';
import { useAuthentication, UserDto } from '../../providers/AuthenticationProvider';
import { Signin } from '../Signin';
import { AppQueryProvider } from '../../providers/AppQueryProvider';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../providers/AuthenticationProvider', () => ({
  useAuthentication: jest.fn(),
}));

const USER_DTO: UserDto = {
  username: 'User',
  password: 'Password',
};

describe('Signin', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
    (useAuthentication as jest.Mock).mockReturnValue({
      authenticationService: {
        signin: jest.fn(),
      },
    });
  });

  it('should sign in', async () => {
    // Arrange
    (useAuthentication().authenticationService.signin as jest.Mock).mockResolvedValue(null);

    // Act
    const { signin } = renderSignin();
    signin();

    // Assert
    await waitFor(() => {
      expect(useNavigate()).toHaveBeenCalled();
    });
    expect(useAuthentication().authenticationService.signin).toHaveBeenCalledWith(USER_DTO);
  });

  it('should disable button while waiting for signing', async () => {
    // Arrange
    (useAuthentication().authenticationService.signin as jest.Mock).mockReturnValue(
      new Promise(() => {})
    );

    // Act
    const { signin, submitButton } = renderSignin();
    signin();

    // Assert
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should show validation error', async () => {
    // Arrange
    (useAuthentication().authenticationService.signin as jest.Mock).mockResolvedValue(null);

    // Act
    const {submitButton} = renderSignin();

    userEvent.click(submitButton);

    // Assert
    expect(await screen.findByText('username must be at least 2 characters')).toBeInTheDocument();
    expect(await screen.findByText('password must be at least 2 characters')).toBeInTheDocument();
  });

  it('should show wrong credentials text when error is 401', async () => {
    // Arrange
    jest.spyOn(console, 'error').mockImplementation();
    const axiosError = new AxiosError('', '', {}, {}, { status: 401 } as AxiosResponse);
    (useAuthentication().authenticationService.signin as jest.Mock).mockRejectedValue(axiosError);

    // Act
    const { signin } = renderSignin();

    signin();

    // Assert
    expect(
      await screen.findByText('Wrong Credentials. Please try again or contact Administrator.')
    ).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith('Error occured while signin', axiosError);
  });

  it('should show generic error message if unknown error was thrown', async () => {
    // Arrange
    jest.spyOn(console, 'error').mockImplementation();
    const error = new Error('ok');
    (useAuthentication().authenticationService.signin as jest.Mock).mockRejectedValue(error);

    // Act
    const { signin } = renderSignin();
    signin();

    // Assert
    expect(
      await screen.findByText(
        'An error occurred during signing. Please try again or contact Administrator.'
      )
    ).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith('Error occured while signin', error);
  });
});

const renderSignin = () => {
  render(
    <AppQueryProvider>
      <Signin />
    </AppQueryProvider>
  );
  const usernameInput = screen.getByLabelText('Username:');
  const passwordInput = screen.getByLabelText('Password:');
  const submitButton = screen.getByRole('button', { name: 'Sign In' });
  return {
    signin: () => {
      userEvent.type(usernameInput, USER_DTO.username);
      userEvent.type(passwordInput, USER_DTO.password);
      userEvent.click(submitButton);
    },
    submitButton,
  };
};
