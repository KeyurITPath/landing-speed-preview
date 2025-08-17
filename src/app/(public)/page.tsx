"use client"
import React, { lazy } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import useHome from './useHome';

// // Lazy load below-the-fold components
const UserReviews = lazy(() => import('../../components/user-reviews'));
// const Faqs = lazy(() => import('../../components/faqs'));
const BecomeAuthor = lazy(() => import('../../components/become-author'));
const GetStartedSteps = lazy(() => import('../../components/get-started-steps'));
// const CoursesByCategory = lazy(() => import('./components/courses-by-category'));

// // Critical above-the-fold components (loaded immediately)
import TopTrendingCourses from '../../components/top-trending-courses';

// // Popups (lazy loaded as they're conditional)
// const SuccessPaymentPopup = lazy(() => import('../../components/success-payment-popup'));
// const FailedPaymentPopup = lazy(() => import('../../components/failed-payment-popup'));
// const TrialPopup = lazy(() => import('../../components/trial-popup'));
const JoinCourse = lazy(() => import('../../components/join-course'));

const Home = () => {
    const useHomeDetails = useHome();
    // const { isPaymentFailed, isPaymentSuccess, isBecomeAMemberWithVerified, shouldOfferTrials } = useHomeDetails;

    return (
        <React.Fragment>
            <Stack
                spacing={{ xs: 4, sm: 10 }}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    my: { xs: 0 }
                }}
            >
                {/* Above-the-fold content loaded immediately */}
                <JoinCourse />
              <TopTrendingCourses {...{ useHomeDetails }} />

                {/* Below-the-fold content lazy loaded */}
                <UserReviews />
                <GetStartedSteps />
                {/* <CoursesByCategory {...{ useHomeDetails }} /> */}
                {/* <Faqs /> */}
                <BecomeAuthor />
            </Stack>

            {/* Conditional popups - lazy loaded */}
            {/* {(isBecomeAMemberWithVerified || shouldOfferTrials) && <TrialPopup {...{ dashboardData: useHomeDetails }} />}
            {isPaymentSuccess && <SuccessPaymentPopup open={isPaymentSuccess} />}
            {isPaymentFailed && <FailedPaymentPopup open={isPaymentFailed} />} */}
        </React.Fragment>
    );
};

export default Home;
