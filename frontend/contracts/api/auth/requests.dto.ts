/** SimpleJWT TokenObtainPairView request body. */
export interface ObtainTokenRequestDto {
  username: string;
  password: string;
}

/** SimpleJWT TokenRefreshView request body. */
export interface RefreshTokenRequestDto {
  refresh: string;
}
