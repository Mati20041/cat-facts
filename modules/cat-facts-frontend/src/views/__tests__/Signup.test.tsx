import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useAuthentication, UserDto } from '../../providers/AuthenticationProvider';
import { AppQueryProvider } from '../../providers/AppQueryProvider';
import { Signup } from '../Signup';

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

describe('Signup', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
    (useAuthentication as jest.Mock).mockReturnValue({
      authenticationService: {
        signup: jest.fn(),
        signin: jest.fn(),
      },
    });
  });

  it('should signup', async () => {
    // Arrange
    (useAuthentication().authenticationService.signup as jest.Mock).mockResolvedValue(null);

    // Act
    const { signup } = renderSignup();
    signup();

    // Assert
    await waitFor(() => {
      expect(useNavigate()).toHaveBeenCalled();
    });
    expect(useAuthentication().authenticationService.signup).toHaveBeenCalledWith(USER_DTO);
    expect(useAuthentication().authenticationService.signin).toHaveBeenCalledWith(USER_DTO);
  });

  it('should disable button while waiting for signup', async () => {
    // Arrange
    (useAuthentication().authenticationService.signup as jest.Mock).mockReturnValue(
      new Promise(() => {})
    );

    // Act
    const { signup, submitButton } = renderSignup();
    signup();

    // Assert
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should show validation error', async () => {
    // Arrange
    (useAuthentication().authenticationService.signup as jest.Mock).mockResolvedValue(null);

    // Act
    const { submitButton } = renderSignup();

    userEvent.click(submitButton);

    // Assert
    expect(await screen.findByText('username must be at least 2 characters')).toBeInTheDocument();
    expect(await screen.findByText('password must be at least 2 characters')).toBeInTheDocument();
  });

  it('should show generic error message if unknown error was thrown', async () => {
    // Arrange
    jest.spyOn(console, 'error').mockImplementation();
    const error = new Error('ok');
    (useAuthentication().authenticationService.signup as jest.Mock).mockRejectedValue(error);

    // Act
    const { signup } = renderSignup();
    signup();

    // Assert
    expect(
      await screen.findByText(
        'An error occurred during account creation. Please try again or contact Administrator.'
      )
    ).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith('Error occured while signup', error);
  });
});

const renderSignup = () => {
  render(
    <AppQueryProvider>
      <Signup />
    </AppQueryProvider>
  );
  const usernameInput = screen.getByLabelText('Username:');
  const passwordInput = screen.getByLabelText('Password:');
  const submitButton = screen.getByRole('button', { name: 'Sign Up' });
  return {
    signup: () => {
      userEvent.type(usernameInput, USER_DTO.username);
      userEvent.type(passwordInput, USER_DTO.password);
      userEvent.click(submitButton);
    },
    submitButton,
  };
};
