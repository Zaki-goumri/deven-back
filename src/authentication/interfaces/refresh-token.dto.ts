export interface RefreshTokenPayload {
  id: number; // User ID
  email: string; // User email
  refreshTokenId: string; // Unique identifier for the refresh token
  iat?: number; // Issued at time (optional)
  exp?: number; // Expiration time (optional)
}
