import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthentication } from '../../providers/AuthenticationProvider';
import { HomePage } from '../HomePage';

jest.mock('../../providers/AuthenticationProvider', () => ({
  useAuthentication: jest.fn(),
}));

jest.mock('../../components/homePage/CatTiles', () => ({
  CatTiles: () => <div data-testid="cat-tiles">miau</div>,
}));

describe('HomePage', () => {
  it('should show NotLoggedUser information', () => {
    // Arrange
    (useAuthentication as jest.Mock).mockReturnValue({ user: null });
    // Act
    renderHomePage();
    // Assert
    expect(
      screen.getByText('Sorry, you need to be authenticated to see Cat Facts 😿')
    ).toBeInTheDocument();
  });

  it('should show cat tiles', () => {
    // Arrange
    (useAuthentication as jest.Mock).mockReturnValue({ user: { username: 'Mati' } });
    // Act
    renderHomePage();
    // Assert
    expect(screen.getByTestId('cat-tiles')).toBeInTheDocument();
  });
});

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};
