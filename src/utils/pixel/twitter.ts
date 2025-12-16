export {}; // 👈 makes this file an external module
import { api } from '../../api';
import { apiAsyncHandler } from '../helper';

export const generateConversionId = (prefix = 'x') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${timestamp}_${random}`;
};

const sendXEventToBE = async (payload: any) => {
  await apiAsyncHandler(async () => {
    await api.pixel.event({ data: payload });
  });
};

declare global {
  interface Window {
    twq?: (...args: any[]) => void;
  }
}

const isTwqReady = () =>
  typeof window !== 'undefined' && typeof window.twq === 'function';

/* Content View Event */
export const trackContentView = async ({
  conversion_id = generateConversionId('view'),
  value = 0,
  currency = 'USD',
  email_address,
}: {
  conversion_id?: string;
  value?: number;
  currency?: string;
  email_address?: string;
}) => {
  // FE (optional)
  if (isTwqReady()) {
    window.twq!('event', 'tw-qw6i7-qwfc7', {
      conversion_id,
      value,
      currency,
      email_address,
    });
  }

  // BE (always)
  await sendXEventToBE({
    event_id: 'tw-qw6i7-qwfc7',
    conversion_id,
    value,
    currency,
    email_address,
  });

  return conversion_id;
};

/* Add to Cart */
export const trackAddToCart = async ({
  conversion_id = generateConversionId('cart'),
  value = 0,
  currency = 'USD',
  email_address,
}: {
  conversion_id?: string;
  value?: number;
  currency?: string;
  email_address?: string;
}) => {
  if (isTwqReady()) {
    window.twq!('event', 'tw-qw6i7-qwfb3', {
      conversion_id,
      value,
      currency,
      email_address,
    });
  }

  await sendXEventToBE({
    event_id: 'tw-qw6i7-qwfb3',
    conversion_id,
    value,
    currency,
    email_address,
  });

  return conversion_id;
};

/* Checkout Initiated */
export const trackCheckoutInitiated = async ({
  conversion_id = generateConversionId('checkout'),
  value = 0,
  currency = 'USD',
  email_address,
}: {
  conversion_id?: string;
  value?: number;
  currency?: string;
  email_address?: string;
}) => {
  if (isTwqReady()) {
    window.twq!('event', 'tw-qw6i7-qwfbp', {
      conversion_id,
      value,
      currency,
      email_address,
    });
  }
  await sendXEventToBE({
    event_id: 'tw-qw6i7-qwfbp',
    conversion_id,
    value,
    currency,
    email_address,
  });

  return conversion_id;
};

/* Purchase */
export const trackPurchase = async ({
  conversion_id = generateConversionId('purchase'),
  value = 0,
  currency = 'USD',
  email_address,
}: {
  conversion_id: string;
  value: number;
  currency: string;
  email_address?: string;
}) => {
  if (isTwqReady()) {
    window.twq!('event', 'tw-qw6i7-qwfbv', {
      conversion_id,
      value,
      currency,
      email_address,
    });
  }

  await sendXEventToBE({
    event_id: 'tw-qw6i7-qwfbv',
    conversion_id,
    value,
    currency,
    email_address,
  });
};
