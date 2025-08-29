import client, { METHODS } from './client';

export const api = {
  auth: {
    login: ({ auth, ...configs }: any) =>
      client({
        url: '/login',
        method: METHODS.POST,
        auth,
        ...configs,
      }),
    verifyOtp: ({ data, ...configs }: { data: any; [key: string]: any }) =>
      client({
        url: '/verify-reset-password',
        method: METHODS.POST,
        data: data as { [key: string]: unknown },
        ...configs,
      }),
    resend: ({ data, ...configs }: { data: unknown; [key: string]: any }) =>
      client({
        url: '/resend-otp',
        method: METHODS.POST,
        data: data as { [key: string]: unknown },
        ...configs,
      }),
    forgotPassword: ({ auth, ...configs }: any) =>
      client({
        url: '/forgot-password',
        method: METHODS.POST,
        data: auth,
        ...configs,
      }),
    resetPassword: ({ auth, ...configs }: any) =>
      client({
        url: '/reset-password',
        method: METHODS.POST,
        data: auth,
        ...configs,
      }),
    changePassword: ({ data, ...configs }: any) =>
      client({
        url: '/change-password',
        method: METHODS.POST,
        data,
        ...configs,
      }),
    verifyToken: ({ data, ...configs }: any) =>
      client({
        url: '/token-verification',
        method: METHODS.POST,
        data,
        ...configs,
      }),
    logout: ({ ...configs }: any) =>
      client({
        url: '/api/logout',
        method: METHODS.POST,
        isServer: true,
        ...configs,
      }),
  },
  cookies: {
    set: ({ data, ...config }: any) =>
      client({
        url: '/api/set-cookies',
        method: METHODS.POST,
        isServer: true,
        cache: 'no-store',
        data,
        ...config,
      }),
  },
  home: {
    countryCode: ({ ...configs }: any) =>
      client({
        url: `/api/countryCode`,
        method: METHODS.GET,
        isServer: true,
        cache: 'no-store',
        ...configs,
      }),
    course: ({ params, ...configs }: any) =>
      client({
        url: `/landingPageDetails`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    fetchDomainDetails: ({ params, ...configs }: any) =>
      client({
        url: `/domain-config`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    fetchHomeCourses: ({ params, ...configs }: any) =>
      client({
        url: `/getcoursesdata`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    getAllPopularCoursesOnBrand: ({ params, ...configs }: any) =>
      client({
        url: `/getcoursebyrating`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    getAllUpSales: ({ params, ...configs }: any) =>
      client({
        url: `/upsaleCourses`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    getAllAnalyticsCredentials: ({ params, ...configs }: any) =>
      client({
        url: `/analyticsCredentials`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    getAllFbAnalyticsCredentials: ({ params, ...configs }: any) =>
      client({
        url: `/fbAnalyticsCredentials`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    getDomainDetails: ({ params, ...configs }: any) =>
      client({
        url: `/domain-image`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
  },
  user: {
    update: ({ data, params, ...configs }: any) =>
      client({
        url: `/user-profile`,
        method: METHODS.POST,
        data,
        params,
        ...configs,
      }),
    get: ({ data, params, ...configs }: any) =>
      client({
        url: `/user-profile`,
        method: METHODS.GET,
        data,
        params,
        ...configs,
      }),
    updateProfileImage: ({ data, id, ...configs }: any) =>
      client({
        url: `/user-profile-image/${id}`,
        method: METHODS.POST,
        data,
        ...configs,
      }),
  },
  getAccess: {
    openAccess: ({ data, ...configs }: any) =>
      client({
        url: `/emailMarketing`,
        method: METHODS.POST,
        data,
        ...configs,
      }),
    orderCheckout: ({ data, ...configs }: any) =>
      client({
        url: `/purchaseCourse`,
        method: METHODS.POST,
        data,
        ...configs,
      }),
    droppedCart: ({ data, ...configs }: any) =>
      client({
        url: `/droppedcart`,
        method: METHODS.POST,
        data,
        ...configs,
      }),
    becomeAMember: ({ data, ...configs }: any) =>
      client({
        url: `/become-member`,
        method: METHODS.POST,
        data,
        ...configs,
      }),
  },
  plan: {
    getDiscountPlan: ({ params, ...configs }: any) =>
      client({
        url: `/subscription-with-discount`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    purchasePlan: ({ data, ...configs }: any) =>
      client({
        url: `/purchase-plan`,
        method: METHODS.POST,
        data,
        ...configs,
      }),
    cancelSubscription: ({ data, ...configs }: any) =>
      client({
        url: `/cancel-subscription`,
        method: METHODS.POST,
        data,
        ...configs,
      }),
    cancelSubscriptionReason: ({ data, ...configs }: any) =>
      client({
        url: `/cancel-subscription-reason`,
        method: METHODS.POST,
        data,
        ...configs,
      }),
  },
  popup: {
    get: ({ params, ...configs }: any) =>
      client({
        url: `/popup`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    getCategories: ({ ...configs }) =>
      client({
        url: `/popup-categories`,
        method: METHODS.GET,
        ...configs,
      }),
    cancelDelay: ({ params, data, ...configs }: any) =>
      client({
        url: `/cancel-delay`,
        method: METHODS.GET,
        data,
        params,
        ...configs,
      }),
    manageBilling: ({ data, id, ...configs }: any) =>
      client({
        url: `/billing-portal-session/${id}`,
        method: METHODS.POST,
        data,
        ...configs,
      }),
    monthlySubscription: ({ data, ...configs }: any) =>
      client({
        url: `/monthly-subscription`,
        method: METHODS.GET,
        data,
        ...configs,
      }),
  },
  pixel: {
    event: ({ data, ...configs }: any) =>
      client({
        url: `/fbAnalytics`,
        method: METHODS.POST,
        data,
        ...configs,
      }),
  },
  common: {
    getAllLanguages: ({ params, ...configs }: any) =>
      client({
        url: `/languages`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
  },
  courseCategories: {
    getAllCourseCategories: ({ params, ...configs }: any) =>
      client({
        url: `/categories`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
  },
  dashboard: {
    fetchDashboardCourses: ({ params, ...configs }: any) =>
      client({
        url: `/getcoursesdata`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    getAllPopularCoursesOnBrand: ({ params, ...configs }: any) =>
      client({
        url: `/getcoursebyrating`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    getAllCourseOfTheWeek: ({ params, ...configs }: any) =>
      client({
        url: `/course-of-week`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    fetchGiftClaimReward: ({ params, ...configs }: any) =>
      client({
        url: `/gift-claim`,
        method: METHODS.POST,
        params,
        ...configs,
      }),
    addUserInteraction: ({ data, ...configs }: any) =>
      client({
        url: '/user-login-days',
        method: METHODS.POST,
        data,
        ...configs,
      }),
    fetchUserInteractedDates: ({ params, ...configs }: any) =>
      client({
        url: '/user-login-days',
        method: METHODS.GET,
        params,
        ...configs,
      }),
    getAllContinueWatchHistoryCoursesData: ({ params, ...configs }: any) =>
      client({
        url: `/user-continue-watch-history`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
  },
  countries: {
    getAllCountries: ({ params, ...configs }: any) =>
      client({
        url: '/countries',
        method: METHODS.GET,
        params,
        ...configs,
      }),
  },
  courseDetails: {
    getAllPopularCoursesDataByCategories: ({ params, ...configs }: any) =>
      client({
        url: `/getcoursesdata`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    getUserCourseProgress: ({ params, ...configs }: any) =>
      client({
        url: `/user-course-progress`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
    getAllRecommendedCourses: ({ data, ...configs }: any) =>
      client({
        url: `/getRecommendedCourse`,
        method: METHODS.GET,
        data,
        ...configs,
      }),
  },
  tolstoyComments: {
    getToken: ({ data, ...configs }: any) =>
      client({
        url: '/generate-tolstoy-token',
        method: 'POST',
        data,
        ...configs,
      }),
    fetchTolstoyScript: ({ params, ...configs }: any) =>
      client({
        url: `/tolstoy-script`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
  },
  trialsActivation: {
    fetchTrialActivation: ({ params, ...configs }: any) =>
      client({
        url: `/admin-ui-control`,
        method: METHODS.GET,
        params,
        ...configs,
      }),
  },
  token: {
    getToken: ({ params, ...configs }: any) =>
      client({
        url: '/subscription-token',
        method: 'GET',
        params,
        ...configs,
      }),
  },
  processToWatch: {
    getProcessToWatch: ({ data, ...configs }: any) =>
      client({
        url: '/user-watch-time-date',
        method: 'POST',
        data,
        ...configs,
      }),
  },
};
