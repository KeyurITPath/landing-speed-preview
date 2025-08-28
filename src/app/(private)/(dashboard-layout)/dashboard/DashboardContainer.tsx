'use client';
import { Grid2 } from '@mui/material';
import { useMemo, useCallback, memo } from 'react';
import useDashboard from './use-dashboard';
import TopTrialBanner from '@/components/dashboard-component/top-trial-banner';
import ContinueWatchingCourses from '@/components/dashboard-component/continue-watching-courses';
import CourseOfTheWeek from '@/components/dashboard-component/course-of-the-week';
import PopularCourseOnBrand from '@/components/dashboard-component/popular-course-on-brand';
import PopularCourseByCategories from '@/components/dashboard-component/popular-course-by-categories';
import { isEmptyObject, shouldOfferTrial } from '@/utils/helper';
import SuccessSubscriptionPopup from '@/components/success-subscription-popup';
import SidebarCalendar from '@/components/dashboard-component/sidebar-calendar';
import TrialPopup from '@/components/trial-popup';
import { USER_ROLE } from '@/utils/constants';

const DashboardContainer = ({
  language_id,
  user,
  domainDetails,
  country_code,
  isBecomeAMemberWithVerified
}: any) => {
  const {
    isTablet,
    COURSE_OF_THE_WEEK_DATA,
    transformDataForTrialBannerTopOfThePage,
    startFreeTrialSubmitForTopOfTheBanner,
    isStartFreeTrialSubmitForTopOfTheBannerLoading,
    isSubscriptionActivated,
    trialPopupClose,
    trialPopupState,
    isCourseOfTheWeekDataLoading,
    ...dashboardData
  } = useDashboard({
    language_id,
    user,
    domainDetails,
    country_code,
  });

  // Memoize the condition checks to prevent unnecessary re-renders
  const shouldShowTrialBanner = useMemo(() => {
    return (
      user?.role !== USER_ROLE.AUTHOR &&
      isBecomeAMemberWithVerified &&
      transformDataForTrialBannerTopOfThePage?.status === 'on' &&
      !user?.is_user_purchased_trial
    );
  }, [
    isBecomeAMemberWithVerified,
    transformDataForTrialBannerTopOfThePage?.status,
    user?.is_user_purchased_trial,
    user?.role,
  ]);

  console.log('shouldShowTrialBanner', user?.role !== USER_ROLE.AUTHOR, isBecomeAMemberWithVerified, !user?.is_user_purchased_trial, transformDataForTrialBannerTopOfThePage?.status)

  const shouldShowCourseOfTheWeek = useMemo(
    () =>
      !isEmptyObject(COURSE_OF_THE_WEEK_DATA) && !isCourseOfTheWeekDataLoading,
    [COURSE_OF_THE_WEEK_DATA, isCourseOfTheWeekDataLoading]
  );

  // Memoize component props to prevent unnecessary re-renders
  const popularCourseProps = useMemo(
    () => ({
      dashboardData: {
        BRAND_NAME: dashboardData.BRAND_NAME,
        isBecomeAMemberWithVerified,
        handleStartFree: dashboardData.handleStartFree,
        POPULAR_BRAND_COURSES_DATA: dashboardData.POPULAR_BRAND_COURSES_DATA,
        isPopularBrandCoursesDataLoading:
          dashboardData.isPopularBrandCoursesDataLoading,
      },
      progress: false,
      className: 'popular-course-on-brand',
    }),
    [
      dashboardData.BRAND_NAME,
      dashboardData.POPULAR_BRAND_COURSES_DATA,
      dashboardData.handleStartFree,
      dashboardData.isPopularBrandCoursesDataLoading,
      isBecomeAMemberWithVerified,
    ]
  );

  const popularCourseByCategoriesProps = useMemo(
    () => ({
      dashboardData: {
        CATEGORIES_BADGE: dashboardData.CATEGORIES_BADGE,
        isBecomeAMemberWithVerified,
        handleStartFree: dashboardData.handleStartFree,
        isCoursesDataLoading: dashboardData.isCourseDataLoading,
        COURSES_DATA: dashboardData.COURSES_DATA,
        filterCategoryHandler: dashboardData.filterCategoryHandler,
        filterCategory: dashboardData.filterCategory,
      },
      progress: false,
    }),
    [
      dashboardData.CATEGORIES_BADGE,
      dashboardData.COURSES_DATA,
      dashboardData.filterCategory,
      dashboardData.filterCategoryHandler,
      dashboardData.handleStartFree,
      dashboardData.isCourseDataLoading,
      isBecomeAMemberWithVerified,
    ]
  );

  const continueWatchingProps = useMemo(
    () => ({
      isBecomeAMemberWithVerified,
      handleStartFree: dashboardData.handleStartFree,
      progress: true,
      className: 'continue-watching-courses',
    }),
    [dashboardData.handleStartFree, isBecomeAMemberWithVerified]
  );

  const courseOfTheWeekProps = useMemo(
    () => ({
      handleStartFree: dashboardData.handleStartFree,
      isBecomeAMemberWithVerified,
      COURSE_OF_THE_WEEK_DATA,
    }),
    [
      COURSE_OF_THE_WEEK_DATA,
      dashboardData.handleStartFree,
      isBecomeAMemberWithVerified,
    ]
  );

  // Render the sidebar calendar component
  const renderSidebarCalendar = useCallback(
    () => <SidebarCalendar dashboardData={dashboardData} />,
    [dashboardData]
  );

  return (
    <>
      <Grid2 container spacing={{ xs: 2, sm: 4 }}>
        <Grid2 size={{ xs: 12, md: 8, lg: 8.5 }}>
          <Grid2 container spacing={{ xs: 2, sm: 4 }}>
            {shouldShowTrialBanner && (
              <Grid2 size={{ xs: 12 }}>
                <TopTrialBanner
                  {...{
                    transformDataForTrialBannerTopOfThePage,
                    startFreeTrialSubmitForTopOfTheBanner,
                    isStartFreeTrialSubmitForTopOfTheBannerLoading,
                  }}
                />
              </Grid2>
            )}
            <Grid2 size={{ xs: 12 }}>
              <ContinueWatchingCourses
                {...continueWatchingProps}
                {...{
                  user,
                  language_id,
                  country_code,
                }}
              />
            </Grid2>
            {isTablet && renderSidebarCalendar()}
            {shouldShowCourseOfTheWeek && (
              <Grid2 size={{ xs: 12 }}>
                <CourseOfTheWeek
                  {...{ loading: isCourseOfTheWeekDataLoading }}
                  {...courseOfTheWeekProps}
                />
              </Grid2>
            )}
            <Grid2 size={{ xs: 12 }}>
              <PopularCourseByCategories
                className='popular-course-by-categories'
                {...popularCourseByCategoriesProps}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <PopularCourseOnBrand {...popularCourseProps} />
            </Grid2>
          </Grid2>
        </Grid2>

        {!isTablet && renderSidebarCalendar()}
      </Grid2>

      {(isBecomeAMemberWithVerified || shouldOfferTrial(user)) && (
        <TrialPopup
          {...{
            dashboardData: {
              trialPopupClose,
              trialPopupState,
            },
          }}
        />
      )}
      <SuccessSubscriptionPopup open={isSubscriptionActivated} />
    </>
  );
};

export default memo(DashboardContainer);
