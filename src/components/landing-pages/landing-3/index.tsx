"use client"
import { Box, Container, Grid } from '@mui/material';
import CourseDetails from './components/course-details';
import CoursePurchaseDetails from './components/course-purchase-details';
import CourseReviews from './components/course-reviews';
import CourseDetailsForWillYouNeed from './components/course-details-need';
import CourseDetailsForWhyChoose from './components/course-details-why-choose';
import CourseDetailsForAuthorInfo from './components/course-details-author-info';
import CourseDetailsForContentInfo from './components/course-details-content-info';
import CourseDetailsForFAQ from './components/course-details-faq';
import AccessPlan from './components/access-plan';
import { getAccessClose } from '@store/features/course.slice';
// import GetAccessForm from './components/get-access-form';
// import SuccessPaymentPopup from '../../success-payment-popup';
// import FailedPaymentPopup from '../../failed-payment-popup';
// import TrialPopup from '../../trial-popup';
// import SuccessSubscriptionPopup from '../../success-subscription-popup';
import { useMemo } from 'react';
import { shouldOfferTrial } from '@utils/helper';
import { useSelector } from 'react-redux';
import useLanding from '../useLanding';

const Landing3 = ({ landingData }) => {
    const {
        isMobile,
        data,
        translatedData,
        loading,
        isVisibleBuyBtn,
        activeForm,
        setActiveForm,
        getAccessState,
        dispatch,
        isPaymentSuccess,
        isPaymentFailed,
        SUPPORT_MAIL,
        activeLandingPage,
        domainName,
        utmData,
        isBecomeAMemberWithVerified,
        isSubscriptionActivated
    } = landingData;

    const { videoContainerRef, videoPlayerOptions, pipMode, closePipMode } = useLanding({translation: translatedData});


    const { user } = useSelector(({ auth }) => auth);

    const shouldOfferTrials = useMemo(() => {
        return shouldOfferTrial(user)
    }, [user])

    return (
        <Box
            sx={{
                width: '100%',
                display: !data?.id || loading ? 'none' : 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Container
                maxWidth="lg"
                sx={{ my: 6 }}
                component={Grid}
                container
                spacing={{ xs: 4, md: 6, xl: 12 }}
            >
                <Grid size={{ xs: 12, md: 7 }}>
                    <Grid container spacing={4}>
                        <CourseDetails {...{ data:translatedData, course:data?.course, isMobile:false, videoContainerRef, videoPlayerOptions, pipMode, closePipMode }} />
                        <CourseReviews {...{ data:translatedData }} />
                        <CourseDetailsForWillYouNeed {...{ data:translatedData }} />
                        <CourseDetailsForWhyChoose {...{ data:translatedData }} />
                        <CourseDetailsForAuthorInfo {...{ data:translatedData, course:data?.course }} />
                        <CourseDetailsForContentInfo {...{ data:translatedData }} />
                        <CourseDetailsForFAQ {...{ BRAND_NAME:"", SUPPORT_MAIL:"support@example.com" }} />
                    </Grid>
                </Grid>
                {!isMobile && (
                    <Grid size={{ xs: 12, md: 5 }}>
                        <CoursePurchaseDetails {...{ course:data?.course, data:translatedData, handleProceedToWatch: () => {}, handleStartFree: () => {}, isBecomeAMemberWithVerified:false, isBecomeVerifiedAndSubscribed:false, isUserPurchasedCourse:false, isMobile:false }} />
                    </Grid>
                )}
            </Container>
            {Boolean(isVisibleBuyBtn) && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        alignItems: 'center',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        zIndex: 99
                    }}
                >
                    <AccessPlan {...{ courseData:data, data:translatedData }} />
                </Box>
            )}

            {/* Get Access Form */}
            {/* <GetAccessForm
                {...{
                    data,
                    course,
                    activeForm,
                    setActiveForm,
                    SUPPORT_MAIL,
                    activeLandingPage,
                    domainName,
                    utmData
                }}
                open={getAccessState}
                onClose={() => {
                    dispatch(getAccessClose());
                }}
            /> */}

            {/* Payment popups */}
            {/* <SuccessPaymentPopup open={isPaymentSuccess} />
            <FailedPaymentPopup open={isPaymentFailed} /> */}

            {/* trial subscription popup */}
            {/* {(isBecomeAMemberWithVerified || shouldOfferTrials) && <TrialPopup {...{ dashboardData: landingData }} />} */}

            {/* <SuccessSubscriptionPopup open={isSubscriptionActivated} /> */}
        </Box>
    );
};

export default Landing3;
