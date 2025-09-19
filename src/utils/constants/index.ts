import momentTimezone from 'moment-timezone';
const SECRET_KEY = process.env.NEXT_PUBLIC_PASSWORD_SECRET || '~!@#$%^&*()_+';

const LOCAL_STORAGE_KEY = 'edzenity:';

const METHODS = {
  GET: 'get',
  DELETE: 'delete',
  HEAD: 'head',
  OPTIONS: 'options',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
};

export const PASSWORD_VALIDATOR_TYPE = {
  ONE_NUMBER: 'one_number',
  ONE_UPPER_CASE: 'one_upper_case',
  ONE_LOWER_CASE: 'one_lower_case',
  ONE_SPECIAL_CHARACTER: 'one_special_character',
  EIGHT_CHARACTER_MIN: 'eight_character_min',
};

export const PASSWORD_VALIDATION_RULES = [
  {
    type: PASSWORD_VALIDATOR_TYPE.ONE_UPPER_CASE,
    label: 'Have One uppercase',
  },
  {
    type: PASSWORD_VALIDATOR_TYPE.ONE_NUMBER,
    label: 'Have One number',
  },
  {
    type: PASSWORD_VALIDATOR_TYPE.ONE_SPECIAL_CHARACTER,
    label: 'Have One special character',
  },
  {
    type: PASSWORD_VALIDATOR_TYPE.EIGHT_CHARACTER_MIN,
    label: 'Be between 8 and 16 characters',
  },
];

const ERROR_MESSAGES = {
  400: 'Invalid request. Please try again.',
  401: 'Please log in to continue.',
  403: 'Access denied.',
  404: 'The content does not exist.',
  408: 'Request took too long. Try again.',
  422: 'Invalid input. Please try again.',
  500: 'Oops! Something went wrong. Try later.',
  502: 'Connection issue. Try later.',
  503: 'Service is down. Try later.',
  504: 'Server took too long. Try again.',
  common: 'Oops! Something went wrong. Try later.',
};

const ORIENTATION = {
  LANDSCAPE: 'landscape',
  PORTRAIT: 'portrait',
};

export const USER_ROLE = {
  CUSTOMER: 'customer',
  AUTHOR: 'author',
};

const ASPECT_RATIO = {
  [ORIENTATION.LANDSCAPE]: 16 / 9,
  [ORIENTATION.PORTRAIT]: 9 / 16,
  LOGO: 1 / 1,
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://54.193.35.97:3004';
const OWN_URL = process.env.NEXT_PUBLIC_OWN_URL || 'https://eduelle.com';
const TOLSTOY_COMMENT_LAST_KEY = process.env.NEXT_PUBLIC_TOLSTOY_COMMENT_LAST_KEY || ''
const GTM_TAG_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

const DOMAIN = typeof window !== 'undefined' ? window.location.origin : 'https://eduelle.com';
// const DOMAIN = 'https://eduelle.com'

const AUTHOR_URL = process.env.NEXT_PUBLIC_REDIRECT_ADMIN_URL;
const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY || '';

const AGE_RANGE = [
  { value: '19-25', label: '19-25' },
  { value: '26-30', label: '26-30' },
  { value: '31-35', label: '31-35' },
  { value: '36-40', label: '36-40' },
  { value: '41-45', label: '41-45' },
  { value: '46-50', label: '46-50' },
  { value: '51-60', label: '51-60' },
  { value: '61-70', label: '61-70' },
  { value: '71-80', label: '71-80' },
  { value: '81+', label: '81+' },
];

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const POPUPS_CATEGORIES = {
  sales: 'sales_popups',
  cancel: 'cancel_popups',
  trial_popups: 'trial_popups',
  trial_banner: 'trial_banner',
  cancel_delay: 'cancel_delay',
};

const SALES_POPUPS_SUB_CATEGORIES = {
  default: 'sales_default_popup',
  warning: 'sales_warning_popup',
  extendTrialMain: 'sales_extended_trial_1',
  extendTrialSecondary: 'sales_extended_trial_2',
  discount: 'sales_discount_popup',
  lifetimeAccess: 'sales_lifetime_access',
  extendTrial: 'sales_extend_trial_popup',
};

const CANCEL_POPUPS_SUB_CATEGORIES = {
  default: 'cancel_default_popup',
  warning: 'cancel_warning_popup',
  extendTrial: 'cancel_extended_trial',
  discountMain: 'cancel_discount_popup_1',
  discountSecondary: 'cancel_discount_popup_2',
  lifetimeAccess: 'cancel_lifetime_access',
  feedback: 'cancel_feedback_popup',
};

const NAV_ITEMS = [{ key: 'courses', path: '/#courses-by-category' }];

const SIDE_NAV_WIDTH = 270;
const TOP_NAV_HEIGHT = 80;

const LANDING_PAGE = {
  landing1: 'L1',
  landing2: 'L2',
  landing3: 'L3',
};

const TIMEZONE = momentTimezone.tz.guess();

const TRIAL_ACTIVATION_METHODS = {
  TRIAL_ACTIVATION_OFFER: 'trial_activation_offer',
  SETTINGS_SUBSCRIPTION_PAGE: 'settings_subscription_page',
  TOP_OF_THE_PAGE_BANNER: 'top_of_the_page_banner',
  SIDE_BANNER: 'side_banner',
  TRIAL_POPUP: 'trial_popup',
  SALES_WARNING_POPUP: 'sales_warning_popup',
  SALES_LIFETIME_ACCESS_POPUP: 'sales_lifetime_access_popup',
  SALES_EXTEND_TRIAL_POPUP: 'sales_extend_trial_popup',
  SALES_EXTEND_TRIAL_1_POPUP: 'sales_extend_trial_1_popup',
  SALES_EXTEND_TRIAL_2_POPUP: 'sales_extend_trial_2_popup',
  SALES_EXTEND_TRIAL_POPUP_INITIAL: 'sales_extend_trial_popup_initial',
  SALES_DISCOUNT_POPUP: 'sales_discount_popup',
  CANCEL_WARNING_POPUP: 'cancel_warning_popup',
  CANCEL_LIFETIME_ACCESS_POPUP: 'cancel_lifetime_access_popup',
  CANCEL_EXTEND_TRIAL_POPUP: 'cancel_extend_trial_popup',
  CANCEL_DISCOUNT_POPUP_1: 'cancel_discount_popup_1',
  CANCEL_DISCOUNT_POPUP_2: 'cancel_discount_popup_2',
  MONTHLY_SUBSCRIPTION_WITH_DISCOUNT: 'monthly_subscription_with_discount',
};
export {
  METHODS,
  SECRET_KEY,
  ASPECT_RATIO,
  SERVER_URL,
  ERROR_MESSAGES,
  AGE_RANGE,
  GENDERS,
  LOCAL_STORAGE_KEY,
  POPUPS_CATEGORIES,
  SALES_POPUPS_SUB_CATEGORIES,
  DOMAIN,
  NAV_ITEMS,
  RAPID_API_KEY,
  SIDE_NAV_WIDTH,
  TOP_NAV_HEIGHT,
  LANDING_PAGE,
  TIMEZONE,
  CANCEL_POPUPS_SUB_CATEGORIES,
  SOCKET_URL,
  TRIAL_ACTIVATION_METHODS,
  AUTHOR_URL,
  OWN_URL,
  TOLSTOY_COMMENT_LAST_KEY,
  GTM_TAG_ID
};
