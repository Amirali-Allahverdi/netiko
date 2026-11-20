import 'server-only';

import { cookies } from 'next/headers';
import {
  TokenRefreshResponseSchema,
  type TokenPairResponseDto,
} from '@/contracts';
import { ApiError } from '../core/api-error';
import { clearAuthCookies, setAuthCookies } from './auth-cookies';
import { isSameOriginMutation } from './auth-route-utils';
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  getBackendBaseUrl,
} from './server-config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const UUID = '[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}';
const routeRules: Array<{ pattern: RegExp; methods: readonly HttpMethod[] }> = [
  { pattern: /^\/api\/accounts\/register\/$/, methods: ['POST'] },
  { pattern: /^\/api\/accounts\/me\/$/, methods: ['GET', 'PUT', 'PATCH'] },
  { pattern: /^\/api\/accounts\/change-password\/$/, methods: ['POST'] },

  { pattern: /^\/api\/workspaces\/$/, methods: ['GET', 'POST'] },
  { pattern: new RegExp(`^/api/workspaces/${UUID}/$`), methods: ['GET', 'PUT', 'PATCH', 'DELETE'] },
  { pattern: new RegExp(`^/api/workspaces/${UUID}/members/$`), methods: ['GET', 'POST'] },
  { pattern: new RegExp(`^/api/workspaces/${UUID}/members/\\d+/$`), methods: ['DELETE'] },
  { pattern: /^\/api\/memberships\/$/, methods: ['GET'] },
  { pattern: new RegExp(`^/api/memberships/${UUID}/$`), methods: ['GET', 'PATCH', 'DELETE'] },

  { pattern: /^\/api\/teams\/$/, methods: ['GET', 'POST'] },
  { pattern: new RegExp(`^/api/teams/${UUID}/$`), methods: ['GET', 'PUT', 'PATCH', 'DELETE'] },
  { pattern: new RegExp(`^/api/teams/${UUID}/members/$`), methods: ['GET', 'POST'] },
  { pattern: new RegExp(`^/api/teams/${UUID}/members/\\d+/$`), methods: ['DELETE'] },

  { pattern: /^\/api\/projects\/$/, methods: ['GET', 'POST'] },
  { pattern: new RegExp(`^/api/projects/${UUID}/$`), methods: ['GET', 'PUT', 'PATCH', 'DELETE'] },
  { pattern: /^\/api\/labels\/$/, methods: ['GET', 'POST'] },
  { pattern: new RegExp(`^/api/labels/${UUID}/$`), methods: ['GET', 'PUT', 'PATCH', 'DELETE'] },

  { pattern: /^\/api\/tasks\/$/, methods: ['GET', 'POST'] },
  { pattern: new RegExp(`^/api/tasks/${UUID}/$`), methods: ['GET', 'PUT', 'PATCH', 'DELETE'] },
  { pattern: new RegExp(`^/api/tasks/${UUID}/status/$`), methods: ['PATCH'] },
  { pattern: new RegExp(`^/api/tasks/${UUID}/assign/$`), methods: ['PATCH'] },

  { pattern: /^\/api\/assignment-rules\/$/, methods: ['GET', 'POST'] },
  { pattern: new RegExp(`^/api/assignment-rules/${UUID}/$`), methods: ['GET', 'PUT', 'PATCH', 'DELETE'] },
  { pattern: /^\/api\/audit-events\/$/, methods: ['GET'] },
  { pattern: new RegExp(`^/api/audit-events/${UUID}/$`), methods: ['GET'] },
  { pattern: /^\/api\/dashboard\/$/, methods: ['GET'] },
];

function jsonError(status: number, detail: string): Response {
  return Response.json(
    { detail },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}

function makeBackendPath(pathSegments: string[]): string {
  const encoded = pathSegments.map((segment) => encodeURIComponent(segment));
  return `/${encoded.join('/')}/`;
}

function getRouteRule(path: string) {
  return routeRules.find((rule) => rule.pattern.test(path));
}

function isHttpMethod(method: string): method is HttpMethod {
  return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
}

function getForwardHeaders(request: Request, accessToken?: string): Headers {
  const headers = new Headers();
  headers.set('Accept', request.headers.get('accept') ?? 'application/json');

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  const requestId = request.headers.get('x-request-id');
  if (requestId) headers.set('X-Request-ID', requestId);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  return headers;
}

async function forwardToBackend(params: {
  request: Request;
  backendPath: string;
  search: string;
  body?: ArrayBuffer;
  accessToken?: string;
}): Promise<Response> {
  const { request, backendPath, search, body, accessToken } = params;
  const method = request.method.toUpperCase();
  const url = `${getBackendBaseUrl()}${backendPath}${search}`;

  return fetch(url, {
    method,
    headers: getForwardHeaders(request, accessToken),
    ...(body !== undefined ? { body } : {}),
    cache: 'no-store',
    redirect: 'manual',
    signal: AbortSignal.timeout(25_000),
  });
}

async function refreshTokens(refreshToken: string): Promise<TokenPairResponseDto | null> {
  const response = await fetch(`${getBackendBaseUrl()}/api/auth/token/refresh/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });

  if (response.status === 400 || response.status === 401) return null;
  if (!response.ok) {
    const payload = response.status >= 500
      ? { detail: 'The backend authentication service could not complete the request.' }
      : await readBackendPayload(response);
    throw ApiError.fromHttp(response.status, payload);
  }

  const payload = await readBackendPayload(response);
  const parsed = TokenRefreshResponseSchema.safeParse(payload);
  if (!parsed.success) {
    await clearAuthCookies();
    throw ApiError.responseValidation(
      'The token refresh response does not match the auth contract.',
      parsed.error.issues,
    );
  }

  return parsed.data;
}

async function readBackendPayload(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

function relayBackendResponse(response: Response, payload?: ArrayBuffer): Response {
  const headers = new Headers();
  if (response.status >= 500) {
    const requestId = response.headers.get('x-request-id');
    const retryAfter = response.headers.get('retry-after');
    if (requestId) headers.set('X-Request-ID', requestId);
    if (retryAfter) headers.set('Retry-After', retryAfter);
    headers.set('Cache-Control', 'no-store');
    return Response.json(
      { detail: 'The backend service could not complete the request.' },
      { status: response.status, headers },
    );
  }

  const allowedHeaders = [
    'content-type',
    'content-disposition',
    'retry-after',
    'x-request-id',
  ];

  for (const name of allowedHeaders) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set('Cache-Control', 'no-store');

  return new Response(
    payload ?? (response.status === 204 || response.status === 205 ? null : response.body),
    { status: response.status, headers },
  );
}

/** Next.js Route Handler implementation for the allow-listed Django API proxy. */
export async function proxyBackendRequest(
  request: Request,
  pathSegments: string[],
): Promise<Response> {
  const method = request.method.toUpperCase();
  if (!isHttpMethod(method)) return jsonError(405, 'Method not allowed.');

  if (method !== 'GET' && !isSameOriginMutation(request)) {
    return jsonError(403, 'Cross-origin request rejected.');
  }

  const backendPath = makeBackendPath(pathSegments);
  const rule = getRouteRule(backendPath);
  if (!rule) return jsonError(404, 'Backend endpoint is not exposed through this proxy.');
  if (!rule.methods.includes(method)) return jsonError(405, 'Method not allowed for this endpoint.');

  const search = new URL(request.url).search;
  const body = method === 'GET' ? undefined : await request.arrayBuffer();
  const cookieStore = await cookies();

  let accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  let refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  // Recover sessions whose access cookie is missing before sending the request.
  if (!accessToken && refreshToken) {
    const refreshed = await refreshTokens(refreshToken);
    if (refreshed) {
      await setAuthCookies(refreshed);
      accessToken = refreshed.access;
      refreshToken = refreshed.refresh;
    } else {
      await clearAuthCookies();
      refreshToken = undefined;
    }
  }

  let upstream = await forwardToBackend({
    request,
    backendPath,
    search,
    body,
    accessToken,
  });

  // Refresh once after an expired access token. The refresh cookie is never
  // exposed to browser JavaScript and rotated tokens are persisted as HttpOnly.
  if (upstream.status === 401 && refreshToken) {
    const refreshed = await refreshTokens(refreshToken);

    if (refreshed) {
      await setAuthCookies(refreshed);
      refreshToken = refreshed.refresh;
      upstream = await forwardToBackend({
        request,
        backendPath,
        search,
        body,
        accessToken: refreshed.access,
      });
    } else {
      await clearAuthCookies();
    }
  }

  if (upstream.status === 401) {
    await clearAuthCookies();
  }

  const payload =
    upstream.status === 204 || upstream.status === 205
      ? undefined
      : await upstream.arrayBuffer();

  return relayBackendResponse(upstream, payload);
}
