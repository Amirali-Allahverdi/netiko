import {
  CurrentUserResponseSchema,
  ObtainTokenRequestSchema,
  TokenPairResponseSchema,
} from '@/contracts';
import { setAuthCookies } from '@/lib/api/server/auth-cookies';
import {
  isSameOriginMutation,
  readJsonBody,
  relayResponse,
} from '@/lib/api/server/auth-route-utils';
import { getBackendBaseUrl } from '@/lib/api/server/server-config';

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

  const input = ObtainTokenRequestSchema.safeParse(await readJsonBody(request));
  if (!input.success) {
    return Response.json(
      { detail: 'Invalid login payload.', errors: input.error.flatten().fieldErrors },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const tokenResponse = await fetch(`${getBackendBaseUrl()}/api/auth/token/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input.data),
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });

    if (!tokenResponse.ok) return relayResponse(tokenResponse);

    const tokens = TokenPairResponseSchema.safeParse(await tokenResponse.json());
    if (!tokens.success) return jsonError(502, 'Authentication service returned an invalid token response.');

    // Retrieve the current user before committing cookies. Access/refresh tokens
    // are never included in the response sent to browser JavaScript.
    const userResponse = await fetch(`${getBackendBaseUrl()}/api/accounts/me/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${tokens.data.access}`,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });

    if (!userResponse.ok) return relayResponse(userResponse);

    const user = CurrentUserResponseSchema.safeParse(await userResponse.json());
    if (!user.success) return jsonError(502, 'Account service returned an invalid user response.');

    await setAuthCookies(tokens.data);

    return Response.json(
      { user: user.data },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return jsonError(504, 'Authentication service timed out.');
    }
    return jsonError(502, 'Authentication service is temporarily unavailable.');
  }
}
