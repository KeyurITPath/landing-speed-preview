'use client';
import React, { lazy } from 'react';
import { Stack } from '@mui/material';
import { useCookieSync } from '@/hooks/use-cookie-sync';
// // Lazy load below-the-fold components
const UserReviews = lazy(() => import('@/components/user-reviews'));
const Faqs = lazy(() => import('@/components/faqs'));
const BecomeAuthor = lazy(() => import('@/components/become-author'));
const GetStartedSteps = lazy(
  () => import('@/components/get-started-steps')
);
const CoursesByCategory = dynamic(() => import('@/components/courses-by-category'), {
  ssr: false,
});


// // Critical above-the-fold components (loaded immediately)
import TopTrendingCourses from '../../components/top-trending-courses';
import useHome from './useHome';
import dynamic from 'next/dynamic';

// // Popups (lazy loaded as they're conditional)
// const SuccessPaymentPopup = lazy(() => import('../../components/success-payment-popup'));
// const FailedPaymentPopup = lazy(() => import('../../components/failed-payment-popup'));
// const TrialPopup = lazy(() => import('../../components/trial-popup'));
const JoinCourse = lazy(() => import('../../components/join-course'));

const ClientSection = ({ homeData, domainDetails, serverLanguageId, serverCountryCode, serverLanguages }: any) => {
  // Sync cookies with server-side values
  useCookieSync(serverLanguageId, serverCountryCode, serverLanguages);

  // const { isPaymentFailed, isPaymentSuccess, isBecomeAMemberWithVerified, shouldOfferTrials } = useHomeDetails;
  const { handleStartFree, filterCategoryHandler, COURSES_DATA, courseDataLoading, filterCategory } = useHome();

  return (
    <React.Fragment>
      <Stack
        spacing={{ xs: 4, sm: 10 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          my: { xs: 0 },
        }}
      >
        {/* Above-the-fold content loaded immediately */}
        <JoinCourse domainDetails={domainDetails} />
        <TopTrendingCourses homeData={{ ...homeData }} />

        {/* Below-the-fold content lazy loaded */}
        <UserReviews />
        <GetStartedSteps />
        <CoursesByCategory
          {...{ homeData, handleStartFree, filterCategoryHandler, COURSES_DATA, courseDataLoading, filterCategory }}
        />
        <Faqs domainDetails={domainDetails} />
        <BecomeAuthor domainDetails={domainDetails}  />
      </Stack>

      {/* Conditional popups - lazy loaded */}
      {/* {(isBecomeAMemberWithVerified || shouldOfferTrials) && <TrialPopup {...{ dashboardData: useHomeDetails }} />}
            {isPaymentSuccess && <SuccessPaymentPopup open={isPaymentSuccess} />}
            {isPaymentFailed && <FailedPaymentPopup open={isPaymentFailed} />} */}
    </React.Fragment>
  );
};

export default ClientSection;
