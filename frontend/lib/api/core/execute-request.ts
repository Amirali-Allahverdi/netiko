import { z } from 'zod';
import { ApiError } from './api-error';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ExecuteRequestOptions<TSchema extends z.ZodType> {
  method?: ApiMethod;
  body?: unknown;
  requestSchema?: z.ZodType;
  responseSchema: TSchema;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
  credentials?: RequestCredentials;
}

export interface ExecuteRequestResult<T> {
  data: T;
  status: number;
  requestId?: string;
  headers: Headers;
}

async function readPayload(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) return undefined;

  const raw = await response.text();
  if (!raw) return undefined;

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json') || contentType.includes('+json')) {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return raw;
    }
  }

  // Some DRF/proxy errors are plain text or HTML. Preserve the text for diagnostics.
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

function combineSignals(
  signal: AbortSignal | undefined,
  timeoutMs: number,
): AbortSignal {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  return signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
}

export async function executeApiRequest<TSchema extends z.ZodType>(
  url: string,
  options: ExecuteRequestOptions<TSchema>,
  additionalHeaders?: HeadersInit,
): Promise<ExecuteRequestResult<z.output<TSchema>>> {
  const method = options.method ?? 'GET';
  const timeoutMs = options.timeoutMs ?? 30_000;
  const headers = new Headers(additionalHeaders);

  new Headers(options.headers).forEach((value, key) => headers.set(key, value));
  headers.set('Accept', 'application/json');

  let body: string | undefined;
  if (options.body !== undefined && method === 'GET') {
    throw ApiError.requestValidation('GET requests cannot include a request body.');
  }

  let outgoingBody: unknown = options.body;
  if (options.requestSchema) {
    const parsedRequest = options.requestSchema.safeParse(options.body);
    if (!parsedRequest.success) {
      throw ApiError.requestValidation(
        'The request payload does not match its API contract.',
        parsedRequest.error.issues,
      );
    }
    outgoingBody = parsedRequest.data;
  }

  if (outgoingBody !== undefined) {
    if (
      typeof FormData !== 'undefined' &&
      outgoingBody instanceof FormData
    ) {
      throw ApiError.configuration(
        'FormData uploads are not supported by this JSON request helper yet.',
      );
    }

    let serializedBody: string | undefined;
    try {
      serializedBody = JSON.stringify(outgoingBody);
    } catch (cause) {
      throw ApiError.requestValidation('The request payload is not JSON-serializable.', cause);
    }
    if (serializedBody === undefined) {
      throw ApiError.requestValidation('The request payload must be JSON-serializable.');
    }

    headers.set('Content-Type', 'application/json');
    body = serializedBody;
  }

  let response: Response;
  let payload: unknown;
  try {
    response = await fetch(url, {
      method,
      headers,
      ...(body !== undefined ? { body } : {}),
      credentials: options.credentials ?? 'same-origin',
      cache: 'no-store',
      signal: combineSignals(options.signal, timeoutMs),
    });
    // Body consumption can also fail due to a timeout or caller cancellation.
    payload = await readPayload(response);
  } catch (cause) {
    if (cause instanceof Error && cause.name === 'TimeoutError') {
      throw ApiError.timeout(cause);
    }
    if (cause instanceof Error && cause.name === 'AbortError') {
      throw ApiError.aborted(cause);
    }
    throw ApiError.network(cause);
  }
  const requestId = response.headers.get('x-request-id') ?? undefined;

  if (!response.ok) {
    throw ApiError.fromHttp(response.status, payload, requestId);
  }

  const parsedResponse = options.responseSchema.safeParse(payload);
  if (!parsedResponse.success) {
    throw ApiError.responseValidation(
      'The server response does not match the expected API contract.',
      parsedResponse.error.issues,
    );
  }

  return {
    data: parsedResponse.data as z.output<TSchema>,
    status: response.status,
    ...(requestId ? { requestId } : {}),
    headers: response.headers,
  };
}
