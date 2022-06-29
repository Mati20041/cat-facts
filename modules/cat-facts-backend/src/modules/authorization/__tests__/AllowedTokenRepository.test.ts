import { InMemoryAllowedTokenRepository } from "../AllowedTokenRepository";

const TOKEN = "TOKEN";

describe("AllowedTokenRepository", () => {
  let allowedTokenRepository: InMemoryAllowedTokenRepository;

  beforeEach(() => {
    allowedTokenRepository = new InMemoryAllowedTokenRepository();
  });

  it("should say token is invalid when it is not added", async () => {
    // Arrange & Act
    const isAllowed = await allowedTokenRepository.isTokenAllowed(TOKEN);

    // Assert
    expect(isAllowed).toBeFalsy();
  });

  it("should say token is valid when is added", async () => {
    // Arrange
    await allowedTokenRepository.addAllowedToken(TOKEN);

    // Act
    const isAllowed = await allowedTokenRepository.isTokenAllowed(TOKEN);

    // Assert
    expect(isAllowed).toBeTruthy();
  });

  it("should say token is invalid when is added and revoked", async () => {
    // Arrange
    await allowedTokenRepository.addAllowedToken(TOKEN);
    await allowedTokenRepository.revokeToken(TOKEN);

    // Act
    const isAllowed = await allowedTokenRepository.isTokenAllowed(TOKEN);

    // Assert
    expect(isAllowed).toBeFalsy();
  });
});
