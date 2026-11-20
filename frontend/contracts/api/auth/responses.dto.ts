/** SimpleJWT obtain response. */
export interface TokenPairResponseDto {
  access: string;
  refresh: string;
}

/** Refresh rotation is enabled in SIMPLE_JWT settings. */
export interface TokenRefreshResponseDto {
  access: string;
  refresh: string;
}
