import { api } from '@/api';
import {
  apiAsyncHandler,
  decodeToken,
  generateEventId,
  getStoredReducerState,
  sha256Hash,
} from '@/utils/helper';
import cookies from 'js-cookie';

export const EVENTS = {
  page_view: 'PageView', // only sent to Facebook
  view_content: 'View Content', // internal event name
  add_to_cart: 'Add to Cart',
  initial_checkout: 'Initiate Checkout',
  purchase: 'Purchase',
  start_trial: 'Start trial',
};

// Track which pixelIds have triggered which events
const pixelEventTracker: Record<string, Set<string>> = {};

/**
 * Trigger event - handles CAPI + FB Pixel
 */
const triggerEvent = async ({
  isAnalyticsCredentialsExists,
  landingMetaPixelId,
  toCheckLandingMetaPixelId = false,
  ...data
}: any) => {
  const token = cookies.get('token');
  const user = decodeToken(token || '');

  const { course } = getStoredReducerState('defaults');

  const fbp = cookies.get('_fbp') || '';
  const fbc = cookies.get('_fbc') || '';
  const country_code = cookies.get('country_code') || '';

  const final_url = cookies.get('final_url') || course.slug;
  const isAnalyticsCredentials = isAnalyticsCredentialsExists
    ? isAnalyticsCredentialsExists
    : cookies.get('isAnalyticsCredentialsExists');
  const meta_pixel_ids = toCheckLandingMetaPixelId
    ? landingMetaPixelId
    : cookies.get('analyticsMetaCredentials');

  // 👇 generate event_id once here
  const event_id = generateEventId();
  // Gather user + device signals
  const response = await fetch('https://api.ipify.org?format=json');
  const ipRes = await response.json();

  const meta_pixels = () => {
    if (typeof meta_pixel_ids === 'string') {
      const parse = JSON.parse(meta_pixel_ids);
      return parse.map((item: any) => item.meta_pixel_id);
    } else return meta_pixel_ids;
  };

  const email = user?.email ? sha256Hash(user?.email || '') : null;
  const phone = user?.phone ? sha256Hash(user?.phone || '') : null;
  const external_id = user?.id ? sha256Hash(user?.id || '') : null;

  let userData = {};
  if (user?.id) {
    const response = await api.user.get({
      params: { user_id: user?.id },
      headers: { 'req-from': country_code },
    });
    userData = response?.data?.data || {};
  }

  const fbParams: Record<string, any> = {
    event_id,
    final_url,
    event_time: Math.floor(Date.now() / 1000),
    url: window.location.href,
    event_source_url: window.location.href,
    user_agent: navigator.userAgent,
    ...(ipRes?.data?.ip ? { ip_address: ipRes?.data?.ip } : {}),
    action_source: 'website',
    client_user_agent: navigator.userAgent,
    ...(user?.id
      ? {
          ...(email ? { em: email } : {}),
          ...(phone ? { ph: phone } : {}),
          ...(external_id ? { external_id } : {}),
          ...(userData?.first_name ? { fn: sha256Hash(userData.first_name) } : {}),
          ...(userData?.last_name ? { ln: sha256Hash(userData.last_name) } : {}),
        }
      : {}),
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
    ...data, // 👈 include extra event data (value, currency, content_ids, etc.)
  };

  // ---- Send to backend analytics (CAPI)
  apiAsyncHandler(async () => {
    if (meta_pixels()?.length || isAnalyticsCredentials) {
      await api.pixel.event({
        data: { ...fbParams },
      });
    }
  });

  // ---- Send to FB Pixel (browser)
  if (meta_pixels()?.length) {
    // Only send 'PageView' to Facebook when event is 'View Content'
    const sendToFbEvent =
      data.eventName === EVENTS.view_content
        ? EVENTS.page_view
        : data.eventName;

    loadFacebookPixel({
      pixelIds: meta_pixels(),
      eventName: sendToFbEvent,
      params: fbParams,
    });
  } else {
    clearMetaPixelHandler();
  }
};

/**
 * Public pixel API
 */
export const pixel = {
  view_content: ({
    isAnalyticsCredentialsExists,
    landingMetaPixelId,
    ...rest
  }: any) =>
    triggerEvent({
      isAnalyticsCredentialsExists,
      eventName: EVENTS.view_content,
      landingMetaPixelId,
      toCheckLandingMetaPixelId: true,
      ...rest,
    }),
  add_to_cart: ({ ...props }) =>
    triggerEvent({
      eventName: EVENTS.add_to_cart,
      ...props,
    }),
  initial_checkout: ({ ...props }) =>
    triggerEvent({
      eventName: EVENTS.initial_checkout,
      ...props,
    }),
  purchase: ({ total_amount, currency = 'USD', ...props }: any) =>
    triggerEvent({
      eventName: EVENTS.purchase,
      value: total_amount,
      currency,
      ...props,
    }),
  start_trial: ({ ...props }) =>
    triggerEvent({
      eventName: EVENTS.start_trial,
      ...props,
    }),
};

/**
 * FB Pixel Loader
 */
export const loadFacebookPixel = ({
  pixelIds = [],
  eventName,
  params = {},
}: {
  pixelIds: string[];
  eventName: string;
  params?: Record<string, any>;
}) => {
  if (!window.fbq) {
    // Initialize fbq
    window.fbq = function () {
      window.fbq.callMethod
        ? window.fbq.callMethod.apply(window.fbq, arguments)
        : window.fbq.queue.push(arguments);
    };
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = '2.0';
    window.fbq.queue = [];
    window.fbq.l = +new Date();

    const fbScript = document.createElement('script');
    fbScript.async = true;
    fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';

    fbScript.onload = () => {
      if (!window._fbq_initialized) {
        pixelIds.forEach((pixelId: string) => {
          window.fbq('init', pixelId);
        });
        window._fbq_initialized = true;
      }
      trackFbqEvent(eventName, params, pixelIds);
    };

    document.head.appendChild(fbScript);
  } else {
    if (!window._fbq_initialized) {
      pixelIds.forEach((pixelId: string) => {
        window.fbq('init', pixelId);
      });
      window._fbq_initialized = true;
    }
    trackFbqEvent(eventName, params, pixelIds);
  }
};

/**
 * Event Tracker
 */
const trackFbqEvent = (
  eventName: string,
  params: Record<string, any>,
  pixelIds: string[]
) => {
  const { event_id } = params;

  pixelIds.forEach((pixelId: string) => {
    if (!pixelEventTracker[pixelId]) {
      pixelEventTracker[pixelId] = new Set();
    }

    if (pixelEventTracker[pixelId].has(eventName)) {
      return; // Skip duplicate
    }

    pixelEventTracker[pixelId].add(eventName);

    // Track with event params
    window.fbq('track', eventName, params, { event_id });
  });
};

/**
 * Cleanup pixel script + trackers
 */
export const clearMetaPixelHandler = () => {
  if (window.fbq) delete window.fbq;
  if (window._fbq) delete window._fbq;
  window._fbq_initialized = false;

  const script = document.querySelector(
    'script[src*="facebook.net/en_US/fbevents.js"]'
  );
  if (script) script.remove();

  // Reset tracker
  for (const key in pixelEventTracker) {
    delete pixelEventTracker[key];
  }
};
