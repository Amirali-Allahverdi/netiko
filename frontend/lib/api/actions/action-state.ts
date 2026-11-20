import { ApiError, type FieldErrors } from '../core/api-error';

export type ActionState<TData = null> =
  | {
      status: 'idle';
      message: null;
      data: null;
      fieldErrors: FieldErrors;
    }
  | {
      status: 'success';
      message: string;
      data: TData;
      fieldErrors: FieldErrors;
    }
  | {
      status: 'error';
      message: string;
      data: null;
      fieldErrors: FieldErrors;
      statusCode?: number;
      code?: string;
    };

export function createInitialActionState<TData = null>(): ActionState<TData> {
  return {
    status: 'idle',
    message: null,
    data: null,
    fieldErrors: {},
  };
}

/** Convenient untyped initial state for actions that do not return data. */
export const initialActionState: ActionState<unknown> = createInitialActionState<unknown>();

/**
 * Maps expected API failures to serializable values suitable for useActionState.
 * Unexpected exceptions are re-thrown so Next.js error boundaries can handle them.
 */
function isExpectedActionError(error: unknown): error is ApiError {
  if (!(error instanceof ApiError)) return false;

  if (error.kind === 'http') {
    // 4xx responses are expected application failures. A 5xx indicates an
    // upstream/server fault and should reach the nearest Next.js error boundary.
    return error.status !== undefined && error.status >= 400 && error.status < 500;
  }

  return (
    error.kind === 'network' ||
    error.kind === 'timeout' ||
    error.kind === 'aborted' ||
    error.kind === 'request_validation'
  );
}

/**
 * Maps expected API failures to serializable values suitable for useActionState.
 * Unexpected failures (5xx, schema drift, configuration bugs) are re-thrown so
 * Next.js can report them through its Error Boundary / observability pipeline.
 */
export async function handleApiAction<TData>(
  operation: () => Promise<TData>,
  successMessage: string,
): Promise<ActionState<TData>> {
  try {
    return {
      status: 'success',
      message: successMessage,
      data: await operation(),
      fieldErrors: {},
    };
  } catch (error) {
    if (!isExpectedActionError(error)) throw error;

    return {
      status: 'error',
      message: error.message,
      data: null,
      fieldErrors: error.fieldErrors,
      ...(error.status !== undefined ? { statusCode: error.status } : {}),
      ...(error.code ? { code: error.code } : {}),
    };
  }
}

/** Structural issue shape compatible with Zod issues; keeps this helper runtime-independent. */
export interface ValidationIssue {
  path: readonly (string | number | symbol)[];
  message: string;
}

/** Convert Zod paths to a serializable map usable by field-level form errors. */
export function zodIssuesToFieldErrors(issues: readonly ValidationIssue[]): FieldErrors {
  const result: FieldErrors = {};

  for (const issue of issues) {
    const key = issue.path.length > 0 ? issue.path.map(String).join('.') : '_form';
    (result[key] ??= []).push(issue.message);
  }

  return result;
}

export function getFieldError(
  fieldErrors: FieldErrors | undefined,
  fieldName: string,
): string | undefined {
  return fieldErrors?.[fieldName]?.[0];
}
