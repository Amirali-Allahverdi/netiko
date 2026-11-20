import 'server-only';

export function isSameOriginMutation(request: Request): boolean {
  try {
    const origin = request.headers.get('origin');
    const requestOrigin = process.env.APP_ORIGIN
      ? new URL(process.env.APP_ORIGIN).origin
      : new URL(request.url).origin;

    if (origin) return new URL(origin).origin === requestOrigin;

    // If Origin is absent, accept only an explicitly same-origin browser request.
    // Reject unknown and same-site (sibling-subdomain) requests by default.
    return request.headers.get('sec-fetch-site') === 'same-origin';
  } catch {
    return false;
  }
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

export async function relayResponse(response: Response): Promise<Response> {
  const headers = new Headers();
  const requestId = response.headers.get('x-request-id');
  if (requestId) headers.set('X-Request-ID', requestId);
  headers.set('Cache-Control', 'no-store');

  // Avoid leaking Django debug pages or infrastructure details to the browser.
  if (response.status >= 500) {
    return Response.json(
      { detail: 'The authentication service could not complete the request.' },
      { status: response.status, headers },
    );
  }

  const body = await response.arrayBuffer();
  const contentType = response.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  return new Response(
    response.status === 204 || response.status === 205 ? null : body,
    { status: response.status, headers },
  );
}
