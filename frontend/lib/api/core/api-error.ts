export type ApiErrorKind =
  | 'http'
  | 'network'
  | 'timeout'
  | 'aborted'
  | 'request_validation'
  | 'response_validation'
  | 'configuration';

export type FieldErrors = Record<string, string[]>;

export interface SerializedApiError {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  code?: string;
  fieldErrors?: FieldErrors;
  requestId?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function collectMessages(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectMessages);
  if (isRecord(value)) {
    return Object.values(value).flatMap(collectMessages);
  }
  return [];
}

function extractFieldErrors(payload: unknown): FieldErrors {
  if (!isRecord(payload)) return {};

  // Our BFF validation responses wrap Zod's field map in `errors`; DRF usually
  // returns the field map directly. Support both shapes without nesting errors.errors.
  const source = isRecord(payload.errors) ? payload.errors : payload;
  const result: FieldErrors = {};

  for (const [key, value] of Object.entries(source)) {
    if (key === 'detail' || key === 'code' || key === 'message') continue;
    const messages = collectMessages(value);
    if (messages.length > 0) result[key] = messages;
  }

  return result;
}


function extractIssueFieldErrors(details: unknown): FieldErrors {
  if (!Array.isArray(details)) return {};

  const result: FieldErrors = {};
  for (const candidate of details) {
    if (!isRecord(candidate) || typeof candidate.message !== 'string') continue;
    if (!Array.isArray(candidate.path)) continue;

    const path = candidate.path.map(String).join('.') || '_form';
    (result[path] ??= []).push(candidate.message);
  }
  return result;
}

function readString(
  value: unknown,
  key: string,
): string | undefined {
  if (!isRecord(value)) return undefined;
  const candidate = value[key];
  return typeof candidate === 'string' ? candidate : undefined;
}

function fallbackHttpMessage(status: number): string {
  switch (status) {
    case 400:
      return 'The submitted data is invalid.';
    case 401:
      return 'Your session is invalid or has expired.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This operation conflicts with the current resource state.';
    case 422:
      return 'The submitted data could not be processed.';
    case 429:
      return 'Too many requests. Please try again shortly.';
    default:
      return status >= 500
        ? 'The server could not complete the request.'
        : 'The request could not be completed.';
  }
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly fieldErrors: FieldErrors;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(params: {
    kind: ApiErrorKind;
    message: string;
    status?: number;
    code?: string;
    fieldErrors?: FieldErrors;
    requestId?: string;
    details?: unknown;
    cause?: unknown;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.kind = params.kind;
    this.status = params.status;
    this.code = params.code;
    this.fieldErrors = params.fieldErrors ?? {};
    this.requestId = params.requestId;
    this.details = params.details;
    if (params.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = params.cause;
    }
  }

  static fromHttp(
    status: number,
    payload: unknown,
    requestId?: string,
  ): ApiError {
    const message =
      readString(payload, 'detail') ??
      readString(payload, 'message') ??
      (typeof payload === 'string' &&
      payload.length > 0 &&
      payload.length < 500 &&
      !/^\s*</.test(payload)
        ? payload
        : undefined) ??
      fallbackHttpMessage(status);

    return new ApiError({
      kind: 'http',
      status,
      message,
      code: readString(payload, 'code'),
      fieldErrors: extractFieldErrors(payload),
      requestId,
      details: payload,
    });
  }

  static network(cause?: unknown): ApiError {
    return new ApiError({
      kind: 'network',
      message: 'Could not connect to the server. Check your connection and try again.',
      cause,
    });
  }

  static timeout(cause?: unknown): ApiError {
    return new ApiError({
      kind: 'timeout',
      message: 'The request took too long. Please try again.',
      cause,
    });
  }

  static aborted(cause?: unknown): ApiError {
    return new ApiError({
      kind: 'aborted',
      message: 'The request was cancelled.',
      cause,
    });
  }

  static requestValidation(message: string, details?: unknown): ApiError {
    return new ApiError({
      kind: 'request_validation',
      message,
      details,
      fieldErrors: extractIssueFieldErrors(details),
    });
  }

  static responseValidation(message: string, details?: unknown): ApiError {
    return new ApiError({
      kind: 'response_validation',
      message,
      details,
    });
  }

  static configuration(message: string): ApiError {
    return new ApiError({ kind: 'configuration', message });
  }

  toJSON(): SerializedApiError {
    return {
      kind: this.kind,
      message: this.message,
      ...(this.status !== undefined ? { status: this.status } : {}),
      ...(this.code ? { code: this.code } : {}),
      ...(Object.keys(this.fieldErrors).length > 0
        ? { fieldErrors: this.fieldErrors }
        : {}),
      ...(this.requestId ? { requestId: this.requestId } : {}),
    };
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Safe, UI-facing message helper. Do not render `details` directly. */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  // Do not leak arbitrary exception messages (URLs, implementation details) to UI.
  return 'An unexpected error occurred. Please try again.';
}
