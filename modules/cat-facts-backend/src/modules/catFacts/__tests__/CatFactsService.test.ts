import axios from "axios";
import { CAT_FACTS_URL, catFactsService } from "../CatFactsService";

jest.mock("axios", () => ({
  get: jest.fn(),
}));

describe("CatFactsService", () => {
  it("should work", async () => {
    // Arrange
    (axios.get as jest.Mock).mockResolvedValue({ data: [] });

    // Act
    const result = await catFactsService.getFacts();

    // Assert
    expect(result).toEqual([]);
    expect(axios.get).toHaveBeenCalledWith(CAT_FACTS_URL);
  });
});
