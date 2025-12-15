export {}; // 👈 makes this file an external module
import { api } from '../../api';
import { apiAsyncHandler } from '../helper';

declare global {
  interface Window {
    twq?: (...args: any[]) => void;
  }
}

const isTwqReady = () =>
  typeof window !== 'undefined' && typeof window.twq === 'function';

/* Content View Event */
export const trackContentView = async ({
  value = 0,
  currency = 'USD',
  email_address = '',
  ...otherParams
}) => {
  if (!isTwqReady()) return;
  const conversion_id = ''
  window.twq!('event', 'tw-qw6i7-qwfc7', {
    conversion_id,
    value,
    currency,
    email_address,
    ...otherParams,
  });
  // API conversation
  await apiAsyncHandler(async () => {
    api.pixel.event({
      data: {
        conversion_id,
        value,
        currency,
        email_address,
        ...otherParams,
      },
    });
  });
};
