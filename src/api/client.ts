import { ERROR_MESSAGES, SERVER_URL } from '../utils/constants';
import { apiAsyncHandler, getTokenSync, isEmptyObject } from '../utils/helper';

const BASE_URL = SERVER_URL;
const DEFAULT_PREFIX = '/api';
const FULL_BASE_URL = `${BASE_URL}${DEFAULT_PREFIX}`;

const FULL_SERVER_URL = `${SERVER_URL}${DEFAULT_PREFIX}`;

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
  cookieToken = '',
  headers = {},
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
  data?: {
    params?: any;
    [key: string]: unknown;
  };
  rest?: Record<string, unknown>;
}) => {
  let fullUrl = isServer
    ? `${FULL_SERVER_URL}${url}`
    : `${FULL_BASE_URL}${url}`;
  let token = cookieToken;

  const { ...restData } = data;

  // Handle query params
  if (!isEmptyObject(params)) {
    const queryParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );
    const queryString = new URLSearchParams(queryParams).toString();
    fullUrl += `?${queryString}`;
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
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(signal && { signal }),
    credentials: 'include',
    ...rest,
  };

  if (restData && method !== METHODS.GET) {
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
        const { data, error } = responseType || {};
        const status: number = error?.status;

        const message =
          ERROR_MESSAGES[String(status) as keyof typeof ERROR_MESSAGES] ||
          ERROR_MESSAGES.common;

        throw {
          status,
          message,
          data,
          apiError: error || {},
        };
      }
    },
    (error: any) => {
      throw error;
    }
  );
};

export default client;
