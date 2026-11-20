import { TokenRefreshResponseSchema } from '@/contracts';
import { clearAuthCookies, setAuthCookies } from '@/lib/api/server/auth-cookies';
import {
  isSameOriginMutation,
  relayResponse,
} from '@/lib/api/server/auth-route-utils';
import { REFRESH_COOKIE_NAME, getBackendBaseUrl } from '@/lib/api/server/server-config';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

function jsonError(status: number, detail: string): Response {
  return Response.json(
    { detail },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOriginMutation(request)) {
    return jsonError(403, 'Cross-origin request rejected.');
  }

  const refreshToken = (await cookies()).get(REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) return jsonError(401, 'No refresh session is available.');

  try {
    const upstream = await fetch(`${getBackendBaseUrl()}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });

    if (!upstream.ok) {
      if (upstream.status === 400 || upstream.status === 401) {
        await clearAuthCookies();
      }
      return relayResponse(upstream);
    }

    const parsed = TokenRefreshResponseSchema.safeParse(await upstream.json());
    if (!parsed.success) {
      await clearAuthCookies();
      return jsonError(502, 'Authentication service returned an invalid refresh response.');
    }

    await setAuthCookies(parsed.data);
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return jsonError(504, 'Authentication service timed out.');
    }
    return jsonError(502, 'Authentication service is temporarily unavailable.');
  }
}
