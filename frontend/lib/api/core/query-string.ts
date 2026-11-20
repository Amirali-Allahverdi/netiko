import { ApiError } from './api-error';

export type QueryPrimitive = string | number | boolean | null | undefined;
export type QueryValue = QueryPrimitive | readonly QueryPrimitive[];
export type QueryParams = object;

export interface QuerySchemaLike {
  safeParse(input: unknown):
    | { success: true; data: unknown }
    | { success: false; error: { issues: readonly unknown[] } };
}

/** Serializes query DTOs without dropping `false` or `0` values. */
export function buildQueryString(query?: object): string {
  if (!query) return '';

  const params = new URLSearchParams();
  const entries = Object.entries(query as Record<string, unknown>);

  for (const [key, value] of entries) {
    if (value === undefined || value === null) continue;

    const values: unknown[] = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item === undefined || item === null) continue;
      if (
        typeof item !== 'string' &&
        typeof item !== 'number' &&
        typeof item !== 'boolean'
      ) {
        throw ApiError.requestValidation(`Unsupported query parameter value for "${key}".`);
      }
      params.append(key, String(item));
    }
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

/** Validate a query DTO before serializing it into URLSearchParams. */
export function parseQueryParams(
  query: object | undefined,
  schema?: QuerySchemaLike,
): object | undefined {
  if (!schema) return query;

  const parsed = schema.safeParse(query ?? {});
  if (!parsed.success) {
    throw ApiError.requestValidation(
      'The query parameters do not match their API contract.',
      parsed.error.issues,
    );
  }

  if (typeof parsed.data !== 'object' || parsed.data === null || Array.isArray(parsed.data)) {
    throw ApiError.requestValidation('A query schema must produce an object.');
  }

  return parsed.data as object;
}
