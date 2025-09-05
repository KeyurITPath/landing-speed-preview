import { ERROR_MESSAGES, SERVER_URL, OWN_URL } from '@/utils/constants';
import { apiAsyncHandler, getTokenSync, isEmptyObject } from '@/utils/helper';

const BASE_URL = SERVER_URL;
const DEFAULT_PREFIX = '/api';
const FULL_BASE_URL = `${BASE_URL}${DEFAULT_PREFIX}`;

export const METHODS = {
  POST: 'post',
  GET: 'get',
  DELETE: 'delete',
  PUT: 'put',
  PATCH: 'patch',
  HEAD: 'head',
  OPTIONS: 'options',
};

const client = async ({
  url = '',
  method = 'GET',
  data = {},
  auth = {},
  cookieToken = '',
  headers = {}, // ✅ don’t set Content-Type here
  params = {},
  isServer = false,
  signal,
  ...rest
}: {
  method: string;
  url: string;
  cookieToken?: string;
  isServer?: boolean;
  headers?: Record<string, string>;
  params?: any;
  signal?: AbortSignal;
  auth?: any;
  data?: any;
  rest?: Record<string, unknown>;
}) => {
  let fullUrl = isServer ? `${OWN_URL}${url}` : `${FULL_BASE_URL}${url}`;
  let token = cookieToken;

  // Handle query params
  if (!isEmptyObject(params)) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    fullUrl += `?${queryString}`;
  }

  // Handle auth
  if (!isEmptyObject(auth)) {
    const basicAuth = btoa(`${auth.username}:${auth.password}`);
    headers.Authorization = `Basic ${basicAuth}`;
  } else if (cookieToken || token) {
    headers.Authorization = `Bearer ${cookieToken || token}`;
  }

  // ✅ On client side, fallback to cookie token
  if (!token && typeof window !== 'undefined') {
    const tokenCookie = getTokenSync();
    token = tokenCookie || '';
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...(token || cookieToken ? { Authorization: `Bearer ${token || cookieToken}` } : {}),
      ...headers, // no forced Content-Type here
    },
    ...(signal && { signal }),
    credentials: 'include',
    ...rest,
  };

  // Only add body for non-GET/HEAD requests
  if (data && ![METHODS.GET, METHODS.HEAD].includes(method.toLowerCase())) {
    if (data instanceof FormData) {
      // For FormData, just pass it directly and let the browser handle the Content-Type
      fetchOptions.body = data;
      // Ensure we don't have any Content-Type header for FormData
      if (fetchOptions.headers) {
        delete (fetchOptions.headers as any)['Content-Type'];
      }
    } else {
      // For JSON data, stringify and set proper Content-Type
      fetchOptions.body = JSON.stringify(data);
      (fetchOptions.headers as any)['Content-Type'] = 'application/json';
    }
  }

  return await apiAsyncHandler(
    async () => {
      const res = await fetch(fullUrl, fetchOptions);
      const isJSON = res.headers.get('Content-Type')?.includes('application/json');
      const responseType = isJSON ? await res.json() : await res.text();

      if (res.ok) {
        return { status: res?.status, data: responseType };
      } else {
        const status: number = responseType?.status;
        const message =
          ERROR_MESSAGES[String(status) as keyof typeof ERROR_MESSAGES] ||
          ERROR_MESSAGES.common;

        throw {
          status,
          message,
          data,
          apiError: responseType || {},
        };
      }
    },
    (error: any) => {
      throw error;
    }
  );
};

export default client;
