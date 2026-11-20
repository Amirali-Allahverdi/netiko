import { clearAuthCookies } from '@/lib/api/server/auth-cookies';
import { isSameOriginMutation } from '@/lib/api/server/auth-route-utils';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<Response> {
  if (!isSameOriginMutation(request)) {
    return Response.json(
      { detail: 'Cross-origin request rejected.' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  // The supplied Django API has no token-blacklist/logout endpoint. This clears
  // the browser's BFF session cookies; server-side token revocation is not claimed.
  await clearAuthCookies();

  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
