import { CatFactDto } from '@cat-facts/shared';
import { CatService } from '../CatService';
import { axiosInstance } from '../../../axios/axiosInstance';

jest.mock('../../../axios/axiosInstance', () => ({
  axiosInstance: {
    get: jest.fn(),
  },
}));

const fixture: CatFactDto[] = [];

describe('CatService', () => {
  it('should fetch data', async () => {
    // Arrange
    (axiosInstance.get as jest.Mock).mockResolvedValue({ data: fixture });
    const catService = new CatService(axiosInstance);
    // Act
    const result = await catService.fetchCatData();
    // Assert
    expect(result).toEqual(fixture);
  });

  it('should pass thrown exception', async () => {
    // Arrange
    const error = new Error('error');
    (axiosInstance.get as jest.Mock).mockRejectedValue(error);
    const catService = new CatService(axiosInstance);
    // Act & Assert
    await expect(catService.fetchCatData()).rejects.toThrow(error);
  });
});
