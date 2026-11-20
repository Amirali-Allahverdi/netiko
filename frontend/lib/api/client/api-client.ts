import 'client-only';

import { z } from 'zod';
import { executeApiRequest, type ApiMethod } from '../core/execute-request';
import { ApiError } from '../core/api-error';
import { buildQueryString, parseQueryParams } from '../core/query-string';

export interface ApiRequestConfig {
  method?: ApiMethod;
  query?: object;
  querySchema?: z.ZodType;
  body?: unknown;
  requestSchema?: z.ZodType;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export type ApiRequestOptions<TSchema extends z.ZodType> = ApiRequestConfig & {
  responseSchema: TSchema;
};

function toProxyUrl(path: string, query?: object): string {
  if (!path.startsWith('/api/')) {
    throw ApiError.configuration(
      `Backend API paths must start with "/api/". Received: ${path}`,
    );
  }

  if (path.includes('..') || path.includes('://') || path.includes('\\')) {
    throw ApiError.configuration('Invalid backend API path.');
  }

  return `/api/backend${path}${buildQueryString(query)}`;
}

/**
 * Browser-side API client. Requests go through the same-origin Next.js BFF;
 * JWT cookies never need to be exposed to JavaScript.
 */
export async function apiRequest<TSchema extends z.ZodType>(
  path: string,
  options: ApiRequestOptions<TSchema>,
): Promise<z.output<TSchema>> {
  const { query, querySchema, ...requestOptions } = options;
  const validatedQuery = parseQueryParams(query, querySchema);
  const result = await executeApiRequest(toProxyUrl(path, validatedQuery), requestOptions);
  return result.data;
}

/** Returns HTTP metadata when a caller needs status or request-id information. */
export async function apiRequestWithMeta<TSchema extends z.ZodType>(
  path: string,
  options: ApiRequestOptions<TSchema>,
) {
  const { query, querySchema, ...requestOptions } = options;
  const validatedQuery = parseQueryParams(query, querySchema);
  return executeApiRequest(toProxyUrl(path, validatedQuery), requestOptions);
}

/** For endpoints that return 204 No Content, such as DELETE endpoints. */
export async function apiRequestVoid(
  path: string,
  options: ApiRequestConfig = {},
): Promise<void> {
  const { query, querySchema, ...requestOptions } = options;
  const validatedQuery = parseQueryParams(query, querySchema);
  await executeApiRequest(toProxyUrl(path, validatedQuery), {
    ...requestOptions,
    responseSchema: z.unknown(),
  });
}

/** For same-origin Next.js endpoints such as /api/auth/login. */
export async function requestNextApi<TSchema extends z.ZodType>(
  path: string,
  options: ApiRequestOptions<TSchema>,
): Promise<z.output<TSchema>> {
  if (!path.startsWith('/api/') || path.startsWith('/api/backend/')) {
    throw ApiError.configuration('Invalid internal Next.js API path.');
  }

  const { query, querySchema, ...requestOptions } = options;
  const validatedQuery = parseQueryParams(query, querySchema);
  const result = await executeApiRequest(
    `${path}${buildQueryString(validatedQuery)}`,
    requestOptions,
  );
  return result.data;
}
