export {}; // 👈 makes this file an external module

export const generateConversionId = (prefix = 'x') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${timestamp}_${random}`;
};

export const TWITTER_EVENTS = {
  view_content: 'tw-qwlow-qwlvv',
  add_to_cart: 'tw-qwlow-qwlw6',
  checkout: 'tw-qwlow-qwlwf',
  purchase: 'tw-qwlow-qwlwg'
}

declare global {
  interface Window {
    twq?: (...args: any[]) => void;
  }
}

const isTwqReady = () =>
  typeof window !== 'undefined' && typeof window.twq === 'function';

/* Content View Event */
export const trackContentView = ({
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
    window.twq!('event', TWITTER_EVENTS.view_content, {
      conversion_id,
      value,
      currency,
      email_address,
    });
  }

  // BE (always)
  // await sendXEventToBE({
  //   event_id: 'tw-qw6i7-qwfc7',
  //   conversion_id,
  //   value,
  //   currency,
  //   email_address,
  // });

  return conversion_id;
};

/* Add to Cart */
export const trackAddToCart = ({
  conversion_id = generateConversionId('cart'),
  value = 0,
  currency = 'USD',
  email_address,
  ...otherProps
}: any) => {
  if (isTwqReady()) {
    window.twq!('event', TWITTER_EVENTS.add_to_cart, {
      conversion_id,
      value,
      currency,
      email_address,
      ...otherProps
    });
  }

  // await sendXEventToBE({
  //   event_id: 'tw-qw6i7-qwfb3',
  //   conversion_id,
  //   value,
  //   currency,
  //   email_address,
  // });

  return conversion_id;
};

/* Checkout Initiated */
export const trackCheckoutInitiated = ({
  conversion_id = generateConversionId('checkout'),
  value = 0,
  currency = 'USD',
  email_address,
  ...otherProps
}: any) => {
  if (isTwqReady()) {
    window.twq!('event', TWITTER_EVENTS.checkout, {
      conversion_id,
      value,
      currency,
      email_address,
      ...otherProps
    });
  }
  // await sendXEventToBE({
  //   event_id: 'tw-qw6i7-qwfbp',
  //   conversion_id,
  //   value,
  //   currency,
  //   email_address,
  // });

  return conversion_id;
};

/* Purchase */
export const trackPurchase = ({
  conversion_id = generateConversionId('purchase'),
  value = 0,
  currency = 'USD',
  email_address,
  ...otherProps
}: any) => {
  if (isTwqReady()) {
    window.twq!('event', TWITTER_EVENTS.purchase, {
      conversion_id,
      value,
      currency,
      email_address,
      ...otherProps
    });
  }

  // await sendXEventToBE({
  //   event_id: 'tw-qw6i7-qwfbv',
  //   conversion_id,
  //   value,
  //   currency,
  //   email_address,
  // });
};
