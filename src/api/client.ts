import { ERROR_MESSAGES, SERVER_URL, OWN_URL } from '@/utils/constants';
import { apiAsyncHandler, getTokenSync, isEmptyObject } from '@/utils/helper';

const BASE_URL = SERVER_URL;
const DEFAULT_PREFIX = '/api';
const FULL_BASE_URL = `${BASE_URL}${DEFAULT_PREFIX}`;

// Enable CORS credentials
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Credentials': 'true',
};

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
  headers = defaultHeaders,
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
  data?: {
    params?: any;
    [key: string]: unknown;
  };
  rest?: Record<string, unknown>;
}) => {
  let fullUrl = isServer ? `${OWN_URL}${url}` : `${FULL_BASE_URL}${url}`;
  let token = cookieToken;

  const { ...restData } = data;

  // Handle query params
  // Handle query params
  if (!isEmptyObject(params)) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`) // no encoding here
      .join('&');

    fullUrl += `?${queryString}`;
  }

    if (!isEmptyObject(auth)) {
      const basicAuth = btoa(`${auth.username}:${auth.password}`);
      headers.Authorization = `Basic ${basicAuth}`;
    }else {
      headers.Authorization = `Bearer ${cookieToken || token}`;
    }

  // ✅ On server, read cookies via `next/headers`
  if (!token && typeof window !== 'undefined') {
    const tokenCookie = getTokenSync();
    token = tokenCookie || '';
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token || cookieToken ? { Authorization: `Bearer ${token || cookieToken}` } : {}),
      ...headers,
    },
    ...(signal && { signal }),
    credentials: 'include',
    ...rest,
  };

  // Only add body for non-GET/HEAD requests
  if (restData && ![METHODS.GET, METHODS.HEAD].includes(method.toLowerCase())) {
    fetchOptions.body = JSON.stringify(restData);
  }

  return await apiAsyncHandler(
    async () => {
      const res = await fetch(fullUrl, fetchOptions);
      const isJSON = res.headers
        .get('Content-Type')
        ?.includes('application/json');
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
