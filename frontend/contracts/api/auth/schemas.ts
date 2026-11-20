import { z } from 'zod';

export const ObtainTokenRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const RefreshTokenRequestSchema = z.object({ refresh: z.string().min(1) });

export const TokenPairResponseSchema = z.object({
  access: z.string().min(1),
  refresh: z.string().min(1),
});

export const TokenRefreshResponseSchema = TokenPairResponseSchema;
