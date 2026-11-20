import 'server-only';

import { cookies } from 'next/headers';
import { z } from 'zod';
import {
  TokenRefreshResponseSchema,
} from '@/contracts';
import {
  executeApiRequest,
  type ApiMethod,
  type ExecuteRequestOptions,
} from '../core/execute-request';
import { ApiError, isApiError } from '../core/api-error';
import { buildQueryString, parseQueryParams } from '../core/query-string';
import { clearAuthCookies, setAuthCookies } from './auth-cookies';
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  getBackendBaseUrl,
} from './server-config';

export interface ServerApiRequestOptions<TSchema extends z.ZodType> {
  method?: ApiMethod;
  query?: object;
  querySchema?: z.ZodType;
  body?: unknown;
  requestSchema?: z.ZodType;
  responseSchema: TSchema;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** Enable only in a Route Handler or Server Action, where cookies may be written. */
  refreshOnUnauthorized?: boolean;
}

async function refreshServerSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) return null;

  let response: Response;
  let payload: unknown;
  try {
    response = await fetch(`${getBackendBaseUrl()}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });
    payload = await readResponseBody(response);
  } catch (cause) {
    if (cause instanceof Error && cause.name === 'TimeoutError') {
      throw ApiError.timeout(cause);
    }
    if (cause instanceof Error && cause.name === 'AbortError') {
      throw ApiError.aborted(cause);
    }
    throw ApiError.network(cause);
  }

  if (response.status === 400 || response.status === 401) {
    await clearAuthCookies();
    return null;
  }

  if (!response.ok) throw ApiError.fromHttp(response.status, payload);

  const parsed = TokenRefreshResponseSchema.safeParse(payload);
  if (!parsed.success) {
    await clearAuthCookies();
    throw ApiError.responseValidation(
      'The token refresh response does not match the auth contract.',
      parsed.error.issues,
    );
  }

  await setAuthCookies(parsed.data);
  return parsed.data.access;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

/**
 * Server Component / Server Action data client. It reads the HttpOnly access
 * cookie and calls Django directly, avoiding an internal HTTP hop through the
 * Next.js Route Handler.
 *
 * Server Components may read cookies but cannot write them while rendering.
 * Set `refreshOnUnauthorized: true` only from a Server Action or Route Handler.
 */
export async function serverApiRequest<TSchema extends z.ZodType>(
  path: string,
  options: ServerApiRequestOptions<TSchema>,
): Promise<z.output<TSchema>> {
  if (!path.startsWith('/api/') || path.includes('..') || path.includes('://')) {
    throw ApiError.configuration('Invalid backend API path.');
  }

  const { query, querySchema, refreshOnUnauthorized = false, ...requestOptions } = options;
  const validatedQuery = parseQueryParams(query, querySchema);

  const run = async (accessToken: string) => {
    const headers = new Headers(requestOptions.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);

    const executeOptions: ExecuteRequestOptions<TSchema> = {
      ...requestOptions,
      headers,
    };

    return executeApiRequest(
      `${getBackendBaseUrl()}${path}${buildQueryString(validatedQuery)}`,
      executeOptions,
    );
  };

  const cookieStore = await cookies();
  let accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  if (!accessToken && refreshOnUnauthorized) {
    accessToken = (await refreshServerSession()) ?? undefined;
  }

  if (!accessToken) {
    throw ApiError.fromHttp(401, { detail: 'Authentication is required.' });
  }

  try {
    const result = await run(accessToken);
    return result.data;
  } catch (error) {
    if (
      refreshOnUnauthorized &&
      isApiError(error) &&
      error.status === 401
    ) {
      const refreshedAccess = await refreshServerSession();
      if (refreshedAccess) {
        try {
          const retryResult = await run(refreshedAccess);
          return retryResult.data;
        } catch (retryError) {
          if (isApiError(retryError) && retryError.status === 401) {
            await clearAuthCookies();
          }
          throw retryError;
        }
      }
    }

    throw error;
  }
}
