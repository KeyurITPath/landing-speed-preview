import { api } from "@/api";
import { apiAsyncHandler, decodeToken, sha256Hash } from "@/utils/helper";
import cookies from 'js-cookie'

export const EVENTS = {
    page_view: 'PageView', // only sent to Facebook
    view_content: 'View Content', // internal event name
    add_to_cart: 'Add to Cart',
    initial_checkout: 'Initiate Checkout',
    purchase: 'Purchase',
    start_trial: 'Start trial'
};

// Track which pixelIds have triggered which events
const pixelEventTracker = {}; // { [pixelId]: Set(['PageView', ...]) }

const triggerEvent = async ({
    isAnalyticsCredentialsExists,
    landingMetaPixelId,
    toCheckLandingMetaPixelId = false,
    ...data
}: any) => {
    const token = cookies.get('token');
    const user = decodeToken(token || '');

    const final_url = cookies.get('final_url') || '';
    const isAnalyticsCredentials = isAnalyticsCredentialsExists
        ? isAnalyticsCredentialsExists
        : cookies.get('isAnalyticsCredentialsExists');
    const meta_pixel_ids = toCheckLandingMetaPixelId
        ? landingMetaPixelId
        : cookies.get('analyticsMetaCredentials');

    // Send to backend analytics
    apiAsyncHandler(async () => {
        if (meta_pixel_ids?.length || isAnalyticsCredentials) {
            await api.pixel.event({
                data: {
                    final_url,
                    ...data,
                    url: window.location.href,
                    ...(user?.id ? { userId: user?.id } : {})
                }
            });
        }
    });

    if (meta_pixel_ids?.length) {
        // Only send 'PageView' to Facebook when event is 'View Content'
        const sendToFbEvent =
            data.eventName === EVENTS.view_content ? EVENTS.page_view : data.eventName;

        if (sendToFbEvent === EVENTS.page_view) {
            const response = await fetch('https://api.ipify.org?format=json');
            const email = user?.email ? await sha256Hash(user?.email) : null;
            const phone = user?.phone ? await sha256Hash(user?.phone) : null;
            loadFacebookPixel({
                pixelIds: meta_pixel_ids,
                ...data,
                url: window.location.href,
                ...(response.data.ip ? { ip_address: response.data.ip } : {}),
                eventName: sendToFbEvent,
                user_agent: navigator.userAgent,
                ...(user?.id ? {
                    ...(email ? { em: email } : {}),
                    ...(phone ? { ph: phone } : {}),
                } : {})
            });
        }
    } else {
        clearMetaPixelHandler();
    }

}


export const pixel = {
    view_content: ({ isAnalyticsCredentialsExists, landingMetaPixelId, ...rest }: any) =>
        triggerEvent({
            isAnalyticsCredentialsExists,
            eventName: EVENTS.view_content,
            landingMetaPixelId,
            toCheckLandingMetaPixelId: true,
            ...rest
        }),
    add_to_cart: ({ ...props }) =>
        triggerEvent({
            eventName: EVENTS.add_to_cart,
            ...props
        }),
    initial_checkout: ({ ...props }) =>
        triggerEvent({
            eventName: EVENTS.initial_checkout,
            ...props
        }),
    purchase: ({ total_amount, ...props }: any) =>
        triggerEvent({
            eventName: EVENTS.purchase,
            total_amount,
            ...props
        }),
    start_trial: ({ ...props }) =>
        triggerEvent({
            eventName: EVENTS.start_trial,
            ...props
        })
};

export const loadFacebookPixel = ({ pixelIds = [], eventName, total_amount }: any) => {
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
                pixelIds.forEach((pixelId: any) => {
                    window.fbq('init', pixelId);
                });
                window._fbq_initialized = true;
            }
            trackFbqEvent(eventName, total_amount, pixelIds);
        };

        document.head.appendChild(fbScript);
    } else {
        if (!window._fbq_initialized) {
            pixelIds.forEach((pixelId: any) => {
                window.fbq('init', pixelId);
            });
            window._fbq_initialized = true;
        }
        trackFbqEvent(eventName, total_amount, pixelIds);
    }
};

const trackFbqEvent = (eventName: any, total_amount: any, pixelIds = []) => {
    pixelIds.forEach((pixelId: any) => {
        // Track only once per pixelId per event
        if (!pixelEventTracker[pixelId]) {
            pixelEventTracker[pixelId] = new Set();
        }

        if (pixelEventTracker[pixelId].has(eventName)) {
            return; // Skip duplicate
        }

        pixelEventTracker[pixelId].add(eventName); // Mark as sent

        switch (eventName) {
            case EVENTS.purchase:
                window.fbq('track', EVENTS.purchase, {
                    value: total_amount,
                    currency: 'USD'
                });
                break;
            case EVENTS.page_view:
            case EVENTS.add_to_cart:
            case EVENTS.initial_checkout:
            case EVENTS.start_trial:
                window.fbq('track', eventName);
                break;
            default:
                window.fbq('track', eventName);
        }
    });
};

export const clearMetaPixelHandler = () => {
    if (window.fbq) delete window.fbq;
    if (window._fbq) delete window._fbq;
    window._fbq_initialized = false;

    const script = document.querySelector('script[src*="facebook.net/en_US/fbevents.js"]');
    if (script) script.remove();

    // Also reset pixelEventTracker
    for (const key in pixelEventTracker) {
        delete pixelEventTracker[key];
    }
};
