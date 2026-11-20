import 'client-only';

import { z } from 'zod';
import {
  CurrentUserResponseSchema,
  ObtainTokenRequestSchema,
} from '@/contracts';
import type {
  CurrentUserResponseDto,
  ObtainTokenRequestDto,
} from '@/contracts';
import { requestNextApi } from '../client/api-client';

const LoginResponseSchema = z.object({
  user: CurrentUserResponseSchema,
});

const SessionMutationResponseSchema = z.object({
  ok: z.boolean(),
});

export type LoginResponse = {
  user: CurrentUserResponseDto;
};

export const authClient = {
  login(payload: ObtainTokenRequestDto): Promise<LoginResponse> {
    return requestNextApi('/api/auth/login', {
      method: 'POST',
      body: payload,
      requestSchema: ObtainTokenRequestSchema,
      responseSchema: LoginResponseSchema,
    });
  },

  async logout(): Promise<void> {
    await requestNextApi('/api/auth/logout', {
      method: 'POST',
      responseSchema: SessionMutationResponseSchema,
    });
  },

  async refresh(): Promise<void> {
    await requestNextApi('/api/auth/refresh', {
      method: 'POST',
      responseSchema: SessionMutationResponseSchema,
    });
  },
};
