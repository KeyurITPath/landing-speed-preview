import TagManager from 'react-gtm-module';

const triggerEvent = ({ event, ...eventData }: any) => {
    TagManager.dataLayer({
        dataLayer: {
            event,
            ...eventData
        }
    });
};

export const gtm = {
    ecommerce: {
        open_cart: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'open_cart',
                category: 'ecommerce',
                action: 'open_cart',
                label,
                value
            }),
        add_to_cart: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'add_to_cart',
                category: 'ecommerce',
                action: 'add_to_cart',
                label,
                value
            }),
        purchase: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'purchase',
                category: 'ecommerce',
                action: 'purchase',
                label,
                value
            }),
        upsale: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'upsale',
                category: 'ecommerce',
                action: 'upsale',
                label,
                value
            }),
        trial_activated: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'trial_activated',
                category: 'ecommerce',
                action: 'trial_activated',
                label,
                value
            }),
        no_trial: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'no_trial',
                category: 'ecommerce',
                action: 'no_trial',
                label,
                value
            })
    },
    trial_activation: {
        trial_top_banner: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'trial_top_banner',
                category: 'trial_activation',
                action: 'trial_top_banner',
                label,
                value
            }),
        trial_middle_banner: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'trial_middle_banner',
                category: 'trial_activation',
                action: 'trial_middle_banner',
                label,
                value
            }),
        trial_side_banner: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'trial_side_banner',
                category: 'trial_activation',
                action: 'trial_side_banner',
                label,
                value
            }),
        trial_dashboard_button: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'trial_dashboard_button',
                category: 'trial_activation',
                action: 'trial_dashboard_button',
                label,
                value
            }),
        trial_account_settings: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'trial_account_settings',
                category: 'trial_activation',
                action: 'trial_account_settings',
                label,
                value
            }),
        warning_popup: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'warning_popup',
                category: 'trial_activation',
                action: 'warning_popup',
                label,
                value
            }),
        extended_trial_popup: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'extended_trial_popup',
                category: 'trial_activation',
                action: 'extended_trial_popup',
                label,
                value
            }),
        discount_popup: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'discount_popup',
                category: 'trial_activation',
                action: 'discount_popup',
                label,
                value
            }),
        trial_activation_popup: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'trial_activation_popup',
                category: 'trial_activation',
                action: 'trial_activation_popup',
                label,
                value
            })
    },
    cancel_subscription: {
        cancel_subscription: ({ label = '', value = '' } = {}) =>
            triggerEvent({
                event: 'cancel_subscription',
                category: 'cancel_subscription',
                action: 'cancel_subscription',
                label,
                value
            })
    },
    mainflow: {
        course_started: ({ label = '', description = ''} = {}) =>
            triggerEvent({
                event: 'course_started',
                category: 'mainflow',
                action: 'course_started',
                label,
                description
            }),
        course_completed: ({ label = '', description = ''} = {}) =>
            triggerEvent({
                event: 'course_completed',
                category: 'mainflow',
                action: 'course_completed',
                label,
                description
            })
    },
    onboarding: {
        onboarding_completed: ({ label = '', description = ''} = {}) =>
            triggerEvent({
                event: 'onboarding_completed',
                category: 'onboarding',
                action: 'onboarding_completed',
                label,
                description
            }),
        onboarding_skipped: ({ label = '', description = ''} = {}) =>
            triggerEvent({
                event: 'onboarding_skipped',
                category: 'onboarding',
                action: 'onboarding_skipped',
                label,
                description
            })
    }
};
