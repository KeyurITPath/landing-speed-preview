import client, { METHODS } from './client';

export const api = {
  auth: {
        login: ({ auth, ...configs }: { auth: unknown; [key: string]: any }) =>
            client({
                url: '/login',
                method: METHODS.POST,
                auth,
                ...configs
            }),
        verifyOtp: ({ data, ...configs }: { data: unknown; [key: string]: any }) =>
            client({
                url: '/verify-reset-password',
                method: METHODS.POST,
                data: data as { [key: string]: unknown },
                ...configs
            }),
        resend: ({ data, ...configs }: { data: unknown; [key: string]: any }) =>
            client({
                url: '/resend-otp',
                method: METHODS.POST,
                data: data as { [key: string]: unknown },
                ...configs
            }),
        forgotPassword: ({ auth, ...configs }) =>
            client({
                url: '/forgot-password',
                method: METHODS.POST,
                data: auth,
                ...configs
            }),
        resetPassword: ({ auth, ...configs }) =>
            client({
                url: '/reset-password',
                method: METHODS.POST,
                data: auth,
                ...configs
            }),
        changePassword: ({ data, ...configs }) =>
            client({
                url: '/change-password',
                method: METHODS.POST,
                data,
                ...configs
            }),
        verifyToken: ({ data, ...configs }) =>
            client({
                url: '/token-verification',
                method: METHODS.POST,
                data,
                ...configs
            })
    },
    home: {
        course: ({ params, ...configs }) =>
            client({
                url: `/landingPageDetails`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        fetchDomainDetails: ({ params, ...configs }) =>
            client({
                url: `/domain-config`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        fetchHomeCourses: ({ params, ...configs }) =>
            client({
                url: `/getcoursesdata`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        getAllPopularCoursesOnBrand: ({ params, ...configs }) =>
            client({
                url: `/getcoursebyrating`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        getAllUpSales: ({ params, ...configs }) =>
            client({
                url: `/upsaleCourses`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        getAllAnalyticsCredentials: ({ params, ...configs }) =>
            client({
                url: `/analyticsCredentials`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        getAllFbAnalyticsCredentials: ({ params, ...configs }) =>
            client({
                url: `/fbAnalyticsCredentials`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        getDomainDetails: ({ params, ...configs }) =>
            client({
                url: `/domain-image`,
                method: METHODS.GET,
                params,
                ...configs
            }),
    },
    user: {
        update: ({ data, params, ...configs }) =>
            client({
                url: `/user-profile`,
                method: METHODS.POST,
                data,
                params,
                ...configs
            }),
        get: ({ data, params, ...configs }) =>
            client({
                url: `/user-profile`,
                method: METHODS.GET,
                data,
                params,
                ...configs
            }),
        updateProfileImage: ({ data, id, ...configs }) =>
            client({
                url: `/user-profile-image/${id}`,
                method: METHODS.POST,
                data,
                ...configs
            })
    },
    getAccess: {
        openAccess: ({ data, ...configs }) =>
            client({
                url: `/emailMarketing`,
                method: METHODS.POST,
                data,
                ...configs
            }),
        orderCheckout: ({ data, ...configs }) =>
            client({
                url: `/purchaseCourse`,
                method: METHODS.POST,
                data,
                ...configs
            }),
        droppedCart: ({ data, ...configs }) =>
            client({
                url: `/droppedcart`,
                method: METHODS.POST,
                data,
                ...configs
            }),
        becomeAMember: ({ data, ...configs }) =>
            client({
                url: `/become-member`,
                method: METHODS.POST,
                data,
                ...configs
            })
    },
    plan: {
        getDiscountPlan: ({ params, ...configs }) =>
            client({
                url: `/subscription-with-discount`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        purchasePlan: ({ data, ...configs }) =>
            client({
                url: `/purchase-plan`,
                method: METHODS.POST,
                data,
                ...configs
            }),
        cancelSubscription: ({ data, ...configs }) =>
            client({
                url: `/cancel-subscription`,
                method: METHODS.POST,
                data,
                ...configs
            }),
        cancelSubscriptionReason: ({ data, ...configs }) =>
            client({
                url: `/cancel-subscription-reason`,
                method: METHODS.POST,
                data,
                ...configs
            })
    },
    popup: {
        get: ({ params, ...configs }) =>
            client({
                url: `/popup`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        getCategories: ({ ...configs }) =>
            client({
                url: `/popup-categories`,
                method: METHODS.GET,
                ...configs
            }),
        cancelDelay: ({ params, data, ...configs }) =>
            client({
                url: `/cancel-delay`,
                method: METHODS.GET,
                data,
                params,
                ...configs
            }),
        manageBilling: ({ data, id, ...configs }) =>
            client({
                url: `/billing-portal-session/${id}`,
                method: METHODS.POST,
                data,
                ...configs
            }),
        monthlySubscription: ({ data, ...configs }) =>
            client({
                url: `/monthly-subscription`,
                method: METHODS.GET,
                data,
                ...configs
            })
    },
    pixel: {
        event: ({ data, ...configs }) =>
            client({
                url: `/fbAnalytics`,
                method: METHODS.POST,
                data,
                ...configs
            })
    },
    common: {
        getAllLanguages: ({ params, ...configs }) =>
            client({
                url: `/languages`,
                method: METHODS.GET,
                params,
                ...configs
            })
    },
    courseCategories: {
        getAllCourseCategories: ({ params, ...configs }) =>
            client({
                url: `/categories`,
                method: METHODS.GET,
                params,
                ...configs
            })
    },
    dashboard: {
        fetchDashboardCourses: ({ params, ...configs }) =>
            client({
                url: `/getcoursesdata`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        getAllPopularCoursesOnBrand: ({ params, ...configs }) =>
            client({
                url: `/getcoursebyrating`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        getAllCourseOfTheWeek: ({ params, ...configs }) =>
            client({
                url: `/course-of-week`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        fetchGiftClaimReward: ({ params, ...configs }) =>
            client({
                url: `/gift-claim`,
                method: METHODS.POST,
                params,
                ...configs
            }),
        addUserInteraction: ({ data, ...configs }) =>
            client({
                url: '/user-login-days',
                method: METHODS.POST,
                data,
                ...configs
            }),
        fetchUserInteractedDates: ({ params, ...configs }) =>
            client({
                url: '/user-login-days',
                method: METHODS.GET,
                params,
                ...configs
            }),
        getAllContinueWatchHistoryCoursesData: ({ params, ...configs }) =>
            client({
                url: `/user-continue-watch-history`,
                method: METHODS.GET,
                params,
                ...configs
            })
    },
    countries: {
        getAllCountries: ({ params, ...configs }) =>
            client({
                url: '/countries',
                method: METHODS.GET,
                params,
                ...configs
            })
    },
    courseDetails: {
        getAllPopularCoursesDataByCategories: ({ params, ...configs }) =>
            client({
                url: `/getcoursesdata`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        getUserCourseProgress: ({ params, ...configs }) =>
            client({
                url: `/user-course-progress`,
                method: METHODS.GET,
                params,
                ...configs
            }),
        getAllRecommendedCourses: ({ data, ...configs }) =>
            client({
                url: `/getRecommendedCourse`,
                method: METHODS.GET,
                data,
                ...configs
            })
    },
    tolstoyComments: {
        getToken: ({ data, ...configs }) =>
            client({
                url: '/generate-tolstoy-token',
                method: 'POST',
                data,
                ...configs
            }),
        fetchTolstoyScript: ({ params, ...configs }) =>
            client({
                url: `/tolstoy-script`,
                method: METHODS.GET,
                params,
                ...configs
            })
    },
    trialsActivation: {
        fetchTrialActivation: ({ params, ...configs }) =>
            client({
                url: `/admin-ui-control`,
                method: METHODS.GET,
                params,
                ...configs
            })
    },
    token: {
        getToken: ({ data, ...configs }) =>
            client({
                url: '/subscription-token',
                method: 'GET',
                data,
                ...configs
            })
    },
    processToWatch: {
        getProcessToWatch: ({ data, ...configs }) =>
            client({
                url: '/user-watch-time-date',
                method: 'POST',
                data,
                ...configs
            })
    }
};
