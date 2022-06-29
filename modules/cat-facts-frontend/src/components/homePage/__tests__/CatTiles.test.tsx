import React from 'react';
import { render, screen } from '@testing-library/react';
import { useQuery } from 'react-query';
import { CatTiles } from '../CatTiles';

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

describe('CatTiles', () => {
  it('should show spinner while fetching', () => {
    // Arrange
    (useQuery as jest.Mock).mockReturnValue({ isFetching: true });
    // Act
    renderCatTiles();
    // Assert
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should show error message when data is not present and is not fetching', () => {
    // Arrange
    (useQuery as jest.Mock).mockReturnValue({ isFetching: false });
    // Act
    renderCatTiles();
    // Assert
    expect(screen.getByText('Error receiving cat facts')).toBeInTheDocument();
  });

  it('should show cat infos', () => {
    // Arrange
    const catFactsFixture = [
      { _id: 1, text: 'first text', source: 'user1', createdAt: '2022-06-21T19:10:09.237Z' },
      { _id: 2, text: 'second text', source: 'user2', createdAt: '2022-06-23T19:10:09.262Z' },
    ];
    const formattedDates = ['2022-06-21 21:10:09', '2022-06-23 21:10:09'];
    (useQuery as jest.Mock).mockReturnValue({ data: catFactsFixture, isFetching: false });

    // Act
    renderCatTiles();

    // Assert
    catFactsFixture.forEach((fact, index) => {
      expect(screen.getByText(fact.text)).toBeInTheDocument();
      expect(screen.getByText(`Source: ${fact.source}`)).toBeInTheDocument();
      expect(screen.getByText(`Created: ${formattedDates[index]}`)).toBeInTheDocument();
    });
  });
});

const renderCatTiles = () => {
  return render(<CatTiles />);
};
