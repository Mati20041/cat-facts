import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CatTiles } from '../CatTiles';
import { catService } from '../CatService';

jest.mock('../CatService', () => ({
  catService: {
    fetchCatData: jest.fn(),
  },
}));

describe('CatTiles', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should show spinner while fetching', () => {
    // Arrange
    (catService.fetchCatData as jest.Mock).mockReturnValue(new Promise(() => {}));

    // Act
    renderCatTiles();

    // Assert
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should show error message when data is not present and is not fetching', async () => {
    // Arrange
    const error = new Error('error');
    (catService.fetchCatData as jest.Mock).mockRejectedValue(error);

    // Act
    renderCatTiles();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Error retrieving cat facts')).toBeInTheDocument();
    });
    expect(console.error).toHaveBeenCalledWith('Error while fetching cat facts', error);
  });

  it('should show cat infos', async () => {
    // Arrange
    const catFactsFixture = [
      { _id: 1, text: 'first text', source: 'user1', createdAt: '2022-06-21T19:10:09.237Z' },
      { _id: 2, text: 'second text', source: 'user2', createdAt: '2022-06-23T19:10:09.262Z' },
    ];
    const formattedDates = ['2022-06-21 21:10:09', '2022-06-23 21:10:09'];
    (catService.fetchCatData as jest.Mock).mockResolvedValue(catFactsFixture);

    // Act
    renderCatTiles();

    // Assert
    await waitFor(() => {
      expect(screen.getByText(catFactsFixture[0].text)).toBeInTheDocument();
    });
    catFactsFixture.forEach((fact, index) => {
      expect(screen.getByText(fact.text)).toBeInTheDocument();
      expect(screen.getByText(`Source: ${fact.source}`)).toBeInTheDocument();
      expect(screen.getByText(`Created: ${formattedDates[index]}`)).toBeInTheDocument();
    });
  });
});

const renderCatTiles = () => {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <CatTiles />
    </QueryClientProvider>
  );
};
