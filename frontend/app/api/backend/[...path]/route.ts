import { ApiError } from '@/lib/api/core/api-error';
import { proxyBackendRequest } from '@/lib/api/server/backend-proxy';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function handler(request: Request, context: RouteContext): Promise<Response> {
  try {
    const { path } = await context.params;
    return await proxyBackendRequest(request, path);
  } catch (error) {
    if (error instanceof ApiError) {
      const status =
        error.kind === 'timeout' ? 504 :
        error.kind === 'configuration' ? 500 :
        error.kind === 'network' ? 502 :
        error.status ?? 502;

      return Response.json(
        { detail: error.message, code: error.code },
        { status, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    if (error instanceof Error && error.name === 'TimeoutError') {
      return Response.json(
        { detail: 'The backend request timed out.' },
        { status: 504, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    return Response.json(
      { detail: 'The backend service is temporarily unavailable.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
