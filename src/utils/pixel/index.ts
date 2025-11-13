import { api } from '@/api';
import {
  apiAsyncHandler,
  decodeToken,
  generateEventId,
  getOrCreateExternalId,
  getStoredReducerState,
  sha256Hash,
} from '@/utils/helper';
import cookies from 'js-cookie';

export const EVENTS = {
  page_view: 'PageView',
  view_content: 'View Content',
  add_to_cart: 'Add to Cart',
  initial_checkout: 'Initiate Checkout',
  purchase: 'Purchase',
  start_trial: 'Start trial',
};

const pixelEventTracker: Record<string, Set<string>> = {};
const initializedPixelIds = new Set<string>();
let fbqStubInjected = false;

const parseMetaPixelIds = (raw: any): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw))
    return raw.map((r) => (typeof r === 'string' ? r : r?.meta_pixel_id)).filter(Boolean);
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed))
        return parsed.map((r) => (typeof r === 'string' ? r : r?.meta_pixel_id)).filter(Boolean);
    } catch {
      return raw.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  if (raw?.meta_pixel_id) return [raw.meta_pixel_id];
  return [];
};

const ensureFbqStub = () => {
  if (typeof window === 'undefined') return;
  if (fbqStubInjected) return;
  fbqStubInjected = true;

  if (!(window as any).fbq) {
    (function (f: any, b: any, e: any, v?: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = (f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
    })(window, document, 'script');
  }

  const existing = document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]');
  if (!existing) {
    const fbScript = document.createElement('script');
    fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
    fbScript.async = true;
    fbScript.onload = () => console.log('[MetaPixel] fbevents.js loaded ✅');
    document.head.appendChild(fbScript);
  }
};

const waitForFbScriptLoad = async (timeoutMs = 8000) => {
  if (typeof window === 'undefined') return;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if ((window as any).fbq && (window as any).fbq.callMethod) return;
    await new Promise((r) => setTimeout(r, 150));
  }
  console.warn('[MetaPixel] fbq not ready within timeout');
};

const waitForFbp = async (maxChecks = 100, intervalMs = 150): Promise<string> => {
  if (typeof window === 'undefined') return '';
  for (let i = 0; i < maxChecks; i++) {
    const val = cookies.get('_fbp');
    if (val) return val;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return '';
};

const trackFbqEvent = (eventName: string, params: Record<string, any>, pixelIds: string[]) => {
  if (!Array.isArray(pixelIds) || pixelIds.length === 0) return;
  const event_id = params?.event_id || '';

  pixelIds.forEach((pid) => {
    if (!pid) return;
    if (!pixelEventTracker[pid]) pixelEventTracker[pid] = new Set();
    const dedupeKey = `${pid}:${eventName}:${event_id}`;
    if (pixelEventTracker[pid].has(dedupeKey)) return;
    pixelEventTracker[pid].add(dedupeKey);

    try {
      (window as any).fbq('track', eventName, params, { eventID: event_id });
    } catch (err) {
      console.warn('[MetaPixel] fbq.track error', err);
    }
  });
};

const waitForPixelsThenTrack = async (
  eventName: string,
  params: Record<string, any>,
  retries = 4,
  delayMs = 1000
) => {
  for (let i = 0; i < retries; i++) {
    const rawMetaPixels = cookies.get('analyticsMetaCredentials');
    const meta_pixels = parseMetaPixelIds(rawMetaPixels);
    if (meta_pixels.length > 0) {
      ensureFbqStub();
      await waitForFbScriptLoad();

      meta_pixels.forEach((id) => {
        if (!initializedPixelIds.has(id)) {
          (window as any).fbq('init', id);
          initializedPixelIds.add(id);
        }
      });

      (window as any).fbq('track', EVENTS.page_view, params, { eventID: params.event_id });
      trackFbqEvent(eventName, params, meta_pixels);
      return;
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
};

const triggerEvent = async ({
  isAnalyticsCredentialsExists,
  landingMetaPixelId,
  toCheckLandingMetaPixelId = false,
  ...data
}: any) => {
  const token = cookies.get('token');
  const user = decodeToken(token || '');
  const { course } = getStoredReducerState('defaults') || {};

  ensureFbqStub();
  await waitForFbScriptLoad();

  const rawMetaPixels = toCheckLandingMetaPixelId
    ? landingMetaPixelId
    : cookies.get('analyticsMetaCredentials');
  const meta_pixels = parseMetaPixelIds(rawMetaPixels);

  const toInit = meta_pixels.filter((id) => id && !initializedPixelIds.has(id));
  if (toInit.length) {
    toInit.forEach((id) => {
      try {
        (window as any).fbq('init', id);
        initializedPixelIds.add(id);
      } catch (err) {
        console.warn('[pixel] fbq.init error', id, err);
      }
    });

    try {
      (window as any).fbq('track', EVENTS.page_view);
    } catch {}
  }

  let fbp = await waitForFbp(80, 150);
  if (!fbp) {
    console.warn('[MetaPixel] _fbp missing after wait — retrying short loop');
    for (let i = 0; i < 10 && !fbp; i++) {
      await new Promise((r) => setTimeout(r, 300));
      fbp = cookies.get('_fbp') || '';
    }
  }

  let fbc = cookies.get('_fbc') || '';
  try {
    const url = new URL(window.location.href);
    const fbclid = url.searchParams.get('fbclid');
    if (fbclid && !fbc) {
      fbc = `fb.${Date.now()}.${fbclid}`;
      cookies.set('_fbc', fbc, { expires: 90, path: '/' });
    }
  } catch {}

  const country_code = cookies.get('country_code') || '';
  const final_url =
    cookies.get('final_url') ||
    (typeof window !== 'undefined' ? window.location.href : '') ||
    course?.slug ||
    'https://default-url.com';

  const isAnalyticsCredentials =
    isAnalyticsCredentialsExists || cookies.get('isAnalyticsCredentialsExists');
  const event_id = generateEventId();

  let ip_address = '';
  try {
    const resp = await fetch('https://api.ipify.org?format=json');
    const j = await resp.json();
    ip_address = j?.ip || '';
  } catch {}

  let userData: Record<string, any> = {};
  if (user?.id) {
    try {
      const res = await api.user.get({
        params: { user_id: user.id },
        headers: { 'req-from': country_code },
      });
      userData = res?.data?.data || {};
    } catch {}
  }

  const email = user?.email ? sha256Hash(user.email) : '';
  const phone = user?.phone ? sha256Hash(user.phone) : '';
  const external_id = user?.id ? sha256Hash(user.id) : await getOrCreateExternalId();

  const fbParams: Record<string, any> = {
    event_id,
    final_url,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: typeof window !== 'undefined' ? window.location.href : '',
    action_source: 'website',
    client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    ...(ip_address ? { ip_address } : {}),
    ...(email ? { em: email } : {}),
    ...(phone ? { ph: phone } : {}),
    ...(external_id ? { external_id } : {}),
    ...(userData?.first_name ? { fn: sha256Hash(userData.first_name) } : {}),
    ...(userData?.last_name ? { ln: sha256Hash(userData.last_name) } : {}),
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
    ...data,
  };

  const eventName = data.eventName || 'unknown';

  await apiAsyncHandler(async () => {
    if ((meta_pixels && meta_pixels.length) || isAnalyticsCredentials) {
      await api.pixel.event({ data: { ...fbParams } });
    }
  });

  if (!meta_pixels || meta_pixels.length === 0) {
    console.warn('[MetaPixel] No pixel IDs → retrying later...');
    waitForPixelsThenTrack(eventName, fbParams);
    return;
  }

  trackFbqEvent(eventName, fbParams, meta_pixels);
};

export const pixel = {
  view_content: (args: any) =>
    triggerEvent({ ...args, eventName: EVENTS.view_content }).catch(console.error),
  add_to_cart: (args: any) =>
    triggerEvent({ ...args, eventName: EVENTS.add_to_cart }).catch(console.error),
  initial_checkout: (args: any) =>
    triggerEvent({ ...args, eventName: EVENTS.initial_checkout }).catch(console.error),
  purchase: ({ total_amount, currency = 'USD', ...args }: any) =>
    triggerEvent({
      ...args,
      eventName: EVENTS.purchase,
      total_amount,
      value: total_amount,
      currency,
    }).catch(console.error),
  start_trial: (args: any) =>
    triggerEvent({ ...args, eventName: EVENTS.start_trial }).catch(console.error),
};

export const prepareMetaFunction = async (landingMetaPixelId?: string[] | string) => {
  if (typeof window === 'undefined') return;
  const raw = landingMetaPixelId || cookies.get('analyticsMetaCredentials');
  const pixels = parseMetaPixelIds(raw);
  if (pixels.length === 0) return;

  ensureFbqStub();
  await waitForFbScriptLoad();

  pixels.forEach((id) => {
    if (!initializedPixelIds.has(id)) {
      try {
        (window as any).fbq('init', id);
        initializedPixelIds.add(id);
      } catch {}
    }
  });

  const fbp = await waitForFbp(80, 100);
  if (fbp) console.log('[MetaPixel.prepare] _fbp ready:', fbp);
  else console.warn('[MetaPixel.prepare] _fbp not available yet (adblocker or delay)');
};

export const clearMetaPixelHandler = () => {
  if (typeof window === 'undefined') return;
  Object.keys(pixelEventTracker).forEach((k) => delete pixelEventTracker[k]);
  initializedPixelIds.clear();
  fbqStubInjected = false;
  try {
    delete (window as any).fbq;
    delete (window as any)._fbq;
  } catch {}
  const script = document.querySelector('script[src*="facebook.net/en_US/fbevents.js"]');
  if (script && script.parentNode) script.parentNode.removeChild(script);
};
