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

const signinMock = jest.fn();
const signupMock = jest.fn();

const navigateMock = jest.fn();

describe('Signup', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
    (useAuthentication as jest.Mock).mockReturnValue({
      authenticationService: {
        signup: signinMock,
        signin: signupMock,
      },
    });
  });

  it('should signup', async () => {
    // Arrange
    signupMock.mockResolvedValue(null);

    // Act
    const { signup } = renderSignup();
    signup();

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalled();
    });
    expect(signupMock).toHaveBeenCalledWith(USER_DTO);
    expect(signinMock).toHaveBeenCalledWith(USER_DTO);
  });

  it('should disable button while waiting for signup', async () => {
    // Arrange
    signupMock.mockReturnValue(new Promise(() => {}));

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
    signupMock.mockResolvedValue(null);

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
    signupMock.mockRejectedValue(error);

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
