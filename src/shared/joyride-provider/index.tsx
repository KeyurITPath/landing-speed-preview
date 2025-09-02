'use client';
import { useRouter, usePathname } from 'next/navigation';
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import Joyride, { ACTIONS, STATUS } from 'react-joyride-next';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '@/api';
import { routes } from '@/utils/constants/routes';
import { updateUser } from '@/store/features/auth.slice';
import ConfirmationPopup from '@/components/confirmation-popup';
import { setSidebarOpen } from '@/store/features/sidebar-slice';
import { linearGradients } from '@/theme/color';
import { gtm } from '@/utils/gtm';
import { useTranslations } from 'next-intl';
import { useMediaQuery } from '@mui/material';
import cookies from 'js-cookie';
import { decodeToken, isEmptyObject } from '@/utils/helper';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchUser } from '@/store/features/user.slice';
import { DOMAIN } from '../../utils/constants';

const JoyrideContext = createContext({});

export const JoyrideProvider = ({ children }: any) => {
  const token = cookies.get('token');
  let user = {};
  const isSidebarOpen = useSelector(
    (state: any) => state.sidebar.isSidebarOpen
  );
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  if (token) {
    user = decodeToken(token);
  }

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const TOUR_STEPS = useMemo(
    () => [
      {
        target: 'body',
        content: t('joyride_tour.welcome_message'),
        placement: 'center',
        disableBeacon: true,
        spotlightClicks: false,
        showSkipButton: true,
      },
      {
        target: '.continue-watching-courses',
        content: t('joyride_tour.continue_watching_hint'),
        placement: 'top',
        disableBeacon: true,
        showSkipButton: true,
        route: routes.private.dashboard,
      },
      {
        target: '.popular-course-by-categories',
        content: t('joyride_tour.explore_categories_hint'),
        placement: 'top',
        disableBeacon: true,
        showSkipButton: true,
        route: routes.private.dashboard,
      },
      {
        target: '.popular-course-on-brand',
        content: t('joyride_tour.top_rated_courses_hint'),
        placement: 'top',
        disableBeacon: true,
        showSkipButton: true,
        route: routes.private.dashboard,
      },
      isMobile
        ? {
            target: '#mobile-menu-icon',
            content: t('joyride_tour.support_via_menu_hint'),
            placement: 'bottom-end',
            disableBeacon: true,
            showSkipButton: true,
            route: routes.private.dashboard,
          }
        : {
            target: '#support',
            content: t('joyride_tour.support_via_menu_hint'),
            placement: 'right',
            disableBeacon: true,
            showSkipButton: true,
            route: routes.private.dashboard,
          },
      {
        // This is the 6th step (index 5)
        target: '#profile-avatar',
        content: t('joyride_tour.profile_avatar_hint'),
        placement: 'right',
        disableBeacon: true,
        showSkipButton: true,
        hideCloseButton: true,
        route: routes.private.settings_and_subscription,
      },
    ],
    [t, isMobile]
  );

  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);
  const [pausedStepIndex, setPausedStepIndex] = useState(0);
  const [hasSkipped, setHasSkipped] = useState(false);
  const [isSkipLoading, setIsSkipLoading] = useState(false);

  const [fetchUserData] = useDispatchWithAbort(fetchUser);

  const { data: userData } = useSelector((state: any) => state.user);

  const isNewUser = useMemo(() => {
    if (isEmptyObject(userData)) return false;
    return user?.is_verified && !userData?.has_completed_onboarding;
  }, [user, userData]);

  useEffect(() => {
    if (user?.id && fetchUserData) {
      fetchUserData({
        params: {
          user_id: user?.id,
          domain: DOMAIN,
        },
        cookieToken: cookies.get('token') || '',
      });
    }
  }, [fetchUserData, user?.id]);

  const updateOnboardingStatus = useCallback(async () => {
    try {
      const response = await api.user.update({
        data: { has_completed_onboarding: true },
        params: { user_id: user?.id },
        cookieToken: cookies.get('token') || '',
      });

      if (response?.status === 200) {
        dispatch(updateUser({ ...user, has_completed_onboarding: true }));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      return false;
    }
  }, [dispatch, user]);

  console.log('isNewUser', isNewUser)

  useEffect(() => {
    // This effect is primarily to auto-start the tour for new users on the dashboard.
    if (
      !hasSkipped &&
      isNewUser &&
      pathname === routes.private.dashboard &&
      !run
    ) {
      setTimeout(() => {
        // If the sidebar is open and the first step (index 0, 'body' target) doesn't need it, close it.
        if (isSidebarOpen) {
          dispatch(setSidebarOpen(false));
          setTimeout(() => setRun(true), 350);
        } else {
          setRun(true);
        }
      }, 1000);
    }
  }, [dispatch, hasSkipped, isNewUser, isSidebarOpen, pathname, run]);

  const handleConfirmSkip = async () => {
    try {
      setIsSkipLoading(true);
      setRun(false);
      setHasSkipped(true);
      await updateOnboardingStatus();
      gtm.onboarding.onboarding_skipped({
        label: 'Onboarding skipped',
        description: 'User skipped the onboarding tour',
      });
      setShowSkipConfirmation(false);
    } catch (error) {
      console.error('Error while skipping tour:', error);
    } finally {
      setIsSkipLoading(false);
    }
  };

  const handleCancelSkip = () => {
    setShowSkipConfirmation(false);
    setStepIndex(pausedStepIndex);
    setRun(true);
  };

  const handleJoyrideCallback = useCallback(
    (data: any) => {
      const { action, index, status, type, lifecycle } = data;
      // 1. Skip or close confirmation
      if (action === ACTIONS.SKIP || action === ACTIONS.CLOSE) {
        setRun(false);
        setHasSkipped(true);
        setPausedStepIndex(index);
        setShowSkipConfirmation(true);
        return;
      }

      // 2. Finish or reset the tour
      if (status === STATUS.FINISHED || action === 'reset') {
        setRun(false);
        if (status === STATUS.FINISHED) {
          updateOnboardingStatus();
          gtm.onboarding.onboarding_completed({
            label: 'Onboarding completed',
            description: 'User completed the onboarding tour',
          });
        }
        return;
      }

      const currentStepConfig = TOUR_STEPS[index];

      // Logic for the 5th step (index 4) - Support/Settings step
      if (index === 4 && lifecycle === 'init') {
        const targetId = currentStepConfig.target.substring(1); // e.g., 'mobile-menu-icon' or 'support'
        let el = document.getElementById(targetId);

        if (!el) {
          setRun(false);
          // For desktop, if target '#support' not found, open sidebar
          if (!isMobile && !isSidebarOpen) {
            dispatch(setSidebarOpen(true));
          }
          // For mobile, #mobile-menu-icon should generally be present.

          setTimeout(() => {
            el = document.getElementById(targetId); // Re-check after potential sidebar open
            if (el) {
              setRun(true);
            } else {
              console.warn(
                `Joyride target '${targetId}' still not found after action.`
              );
            }
          }, 600); // Increased delay slightly for sidebar animation
          return;
        }
      }

      // Logic for AFTER the 5th step (index 4) when clicking NEXT
      // This step navigates to the Settings page for the #profile-avatar step
      if (type === 'step:after' && action === ACTIONS.NEXT && index === 4) {
        setRun(false);
        // If on desktop and sidebar was opened for '#support', close it before navigating
        if (!isMobile && isSidebarOpen) {
          dispatch(setSidebarOpen(false));
        }

        // The next step (#profile-avatar) is on the SETTINGS_AND_SUBSCRIPTION.path
        router.push(routes.private.settings_and_subscription);

        setTimeout(() => {
          // The target for the next step (index 5)
          const nextStepTargetId = TOUR_STEPS[index + 1].target.substring(1); // Should be 'profile-avatar'
          const avatarElement = document.getElementById(nextStepTargetId);

          if (avatarElement) {
            avatarElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            setStepIndex(index + 1); // Set to the #profile-avatar step index (5)
            setRun(true);
          } else {
            // Fallback if avatar not immediately found (e.g., page still loading)
            const waitForAvatar = setInterval(() => {
              const elCheck = document.getElementById(nextStepTargetId);
              if (elCheck) {
                clearInterval(waitForAvatar);
                elCheck.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setStepIndex(index + 1); // Set to the #profile-avatar step index (5)
                setRun(true);
              }
            }, 300);
            setTimeout(() => clearInterval(waitForAvatar), 5000); // Timeout for waiting
          }
        }, 800); // Delay for navigation and page rendering
        return;
      }

      // General NEXT logic (including manual FINISHED handling)
      if (type === 'step:after' && action === ACTIONS.NEXT) {
        const nextIndex = index + 1;
        const isLastStep = index === TOUR_STEPS.length - 1;

        if (isLastStep) {
          updateOnboardingStatus().then(() => {
            setTimeout(() => {
              router.push(routes.private.dashboard);
            }, 500);
          });
          setRun(false);
          return;
        }

        const nextStep = TOUR_STEPS[nextIndex];
        if (nextStep.route && nextStep.route !== location.pathname) {
          setRun(false);
          router.push(nextStep.route);
          setTimeout(() => {
            setStepIndex(nextIndex);
            setRun(true);
          }, 1000);
        } else {
          setStepIndex(nextIndex);
        }
        return;
      }

      if (type === 'step:after' && action === ACTIONS.PREV) {
        const prevIndex = index - 1;

        if (prevIndex >= 0) {
          const prevStep = TOUR_STEPS[prevIndex];

          // If going back from #profile-avatar (index 5) to the conditional step (index 4)
          // and on desktop where sidebar might have been closed, ensure it's open if needed.
          if (index === 5 && !isMobile && prevStep.target === '#support') {
            if (!isSidebarOpen) {
              dispatch(setSidebarOpen(true));
            }
          } else if (
            isSidebarOpen &&
            !(prevIndex === 4 && !isMobile && prevStep.target === '#support')
          ) {
            dispatch(setSidebarOpen(false));
          }

          if (prevStep.route && prevStep.route !== location.pathname) {
            setRun(false);
            router.push(prevStep.route);
            setTimeout(() => {
              setStepIndex(prevIndex);
              setRun(true);
            }, 1000);
          } else {
            setStepIndex(prevIndex);
          }
        }
        return;
      }

      // Fallback logic — for edge actions
      if (
        type === 'step:after' &&
        action !== ACTIONS.NEXT &&
        action !== ACTIONS.PREV
      ) {
        const nextIndex = action === ACTIONS.NEXT ? index + 1 : index - 1;
        if (nextIndex >= 0 && nextIndex < TOUR_STEPS.length) {
          const step = TOUR_STEPS[nextIndex];
          if (step.route && step.route !== location.pathname) {
            setRun(false);
            router.push(step.route);
            setTimeout(() => {
              setStepIndex(nextIndex);
              setRun(true);
            }, 1000);
          } else {
            setStepIndex(nextIndex);
          }
        }
      }
    },
    [
      TOUR_STEPS,
      updateOnboardingStatus,
      isMobile,
      isSidebarOpen,
      dispatch,
      router,
    ]
  );

  return (
    <JoyrideContext.Provider value={{ run, setRun }}>
      <ConfirmationPopup
        open={showSkipConfirmation}
        onClose={handleCancelSkip}
        handleSubmit={handleConfirmSkip}
        modelTitle={t('skip_tour')}
        confirmationText={t('confirm_text')}
        actionLabel={t('yes')}
        closeLabel={t('no')}
        maxWidth='xs'
        loading={isSkipLoading}
      />
      <Joyride
        steps={TOUR_STEPS}
        run={run}
        stepIndex={stepIndex}
        continuous
        showSkipButton
        disableOverlayClose
        disableCloseOnEsc
        showProgress={false}
        callback={handleJoyrideCallback}
        scrollOffset={80}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: linearGradients.primary,
            backgroundColor: '#ffffff',
            arrowColor: '#ffffff',
            overlayColor: 'rgba(0, 0, 0, 0.7)',
          },
          tooltip: {
            fontSize: '16px',
            padding: '15px',
          },
          buttonNext: {
            background: '#5B97F8',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
          },
          buttonBack: {
            color: '#3f51b5',
          },
          buttonSkip: {
            background: '#f44336',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
          },
        }}
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'OK',
          next: 'OK',
          open: 'Open',
          skip: 'Skip all',
        }}
      />
      {children}
    </JoyrideContext.Provider>
  );
};

export const useJoyride = () => useContext(JoyrideContext);
export default JoyrideProvider;
