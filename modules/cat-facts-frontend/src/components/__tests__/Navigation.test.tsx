import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthentication } from '../../providers/AuthenticationProvider';
import { Navigation } from '../Navigation';

jest.mock('../../providers/AuthenticationProvider', () => ({
  useAuthentication: jest.fn(),
}));

describe('Navigation', () => {
  it('should show signin/up buttons when user is not present', () => {
    // Arrange
    (useAuthentication as jest.Mock).mockReturnValue({ user: null });
    // Act
    renderNavigation();
    // Assert
    expect(screen.getByRole('link', { name: 'Signin' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Signup' })).toBeInTheDocument();
  });

  it('should show logged username', () => {
    // Arrange
    (useAuthentication as jest.Mock).mockReturnValue({ user: { username: 'Mati' } });
    // Act
    renderNavigation();
    // Assert

    expect(screen.getByText(`Logged user: Mati`)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Signin' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Signup' })).not.toBeInTheDocument();
  });
});

const renderNavigation = () => {
  return render(
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  );
};
