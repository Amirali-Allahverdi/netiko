import 'server-only';
import { ApiError } from '../core/api-error';

export const ACCESS_COOKIE_NAME = 'netiko_access';
export const REFRESH_COOKIE_NAME = 'netiko_refresh';

export const ACCESS_TOKEN_MAX_AGE_SECONDS = 8 * 60 * 60;
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function getBackendBaseUrl(): string {
  const configuredUrl = process.env.BACKEND_API_URL;
  if (!configuredUrl) {
    throw ApiError.configuration(
      'BACKEND_API_URL is not configured. Add it to the server environment.',
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(configuredUrl);
  } catch {
    throw ApiError.configuration('BACKEND_API_URL must be a valid absolute URL.');
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw ApiError.configuration('BACKEND_API_URL must use HTTP or HTTPS.');
  }

  return parsedUrl.toString().replace(/\/+$/, '');
}
