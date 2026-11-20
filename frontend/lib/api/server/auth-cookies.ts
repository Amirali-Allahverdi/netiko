import 'server-only';

import { cookies } from 'next/headers';
import type { TokenPairResponseDto } from '@/contracts';
import {
  ACCESS_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from './server-config';

const commonCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  priority: 'high' as const,
};

export async function getAuthTokens() {
  const cookieStore = await cookies();
  return {
    access: cookieStore.get(ACCESS_COOKIE_NAME)?.value ?? null,
    refresh: cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null,
  };
}

export async function setAuthCookies(tokens: TokenPairResponseDto): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE_NAME, tokens.access, {
    ...commonCookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });

  // SimpleJWT has ROTATE_REFRESH_TOKENS enabled in the supplied backend.
  // Always persist the rotated refresh token returned by the refresh endpoint.
  cookieStore.set(REFRESH_COOKIE_NAME, tokens.refresh, {
    ...commonCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE_NAME, '', {
    ...commonCookieOptions,
    maxAge: 0,
  });
  cookieStore.set(REFRESH_COOKIE_NAME, '', {
    ...commonCookieOptions,
    maxAge: 0,
  });
}
