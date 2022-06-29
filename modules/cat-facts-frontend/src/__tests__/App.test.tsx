import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('should render correctly', () => {
    // Arrange
    render(<App />);

    // Act & Assert
    expect(
      screen.getByText('Sorry, you need to be authenticated to see Cat Facts 😿')
    ).toBeInTheDocument();
  });
});
