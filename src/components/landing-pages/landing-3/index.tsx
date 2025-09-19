'use client';
import { Box, Container, Grid2 } from '@mui/material';
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
import GetAccessForm from './components/get-access-form';
import { useMemo } from 'react';
import { shouldOfferTrial } from '@utils/helper';
import { useSelector } from 'react-redux';
import SuccessPaymentPopup from '../../success-payment-popup';
import FailedPaymentPopup from '../../failed-payment-popup';
import TrialPopup from '../../trial-popup';
import SuccessSubscriptionPopup from '../../success-subscription-popup';

const Landing3 = ({ landingData, vimeoSource }: any) => {
  const {
    isMobile,
    data,
    loading,
    isVisibleBuyBtn,
    course,
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
    isSubscriptionActivated,
  } = landingData;

  const { user } = useSelector(({ auth }: any) => auth);

  const shouldOfferTrials = useMemo(() => {
    return shouldOfferTrial(user);
  }, [user]);

  return (
    <Box
      sx={{
        width: '100%',
        display: !data?.id || loading ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container
        maxWidth='lg'
        sx={{ my: 6 }}
        component={Grid2}
        container
        spacing={{ xs: 4, md: 6, xl: 12 }}
      >
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Grid2 container spacing={4}>
            <Grid2 container spacing={4}>
              <CourseDetails {...{ landingData, vimeoSource }} />
              <CourseReviews {...{ landingData }} />
              <CourseDetailsForWillYouNeed {...{ landingData }} />
              <CourseDetailsForWhyChoose {...{ landingData }} />
              <CourseDetailsForAuthorInfo {...{ landingData }} />
              <CourseDetailsForContentInfo {...{ landingData }} />
              <CourseDetailsForFAQ {...{ landingData }} />
            </Grid2>
          </Grid2>
        </Grid2>
        {!isMobile && (
          <Grid2 size={{ xs: 12, md: 5 }}>
            <CoursePurchaseDetails {...{ landingData }} />
          </Grid2>
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
            zIndex: 99,
          }}
        >
          <AccessPlan {...{ landingData }} />
        </Box>
      )}

      {/* Get Access Form */}
      <GetAccessForm
        {...{
          data,
          course,
          activeForm,
          setActiveForm,
          SUPPORT_MAIL,
          activeLandingPage,
          domainName,
          utmData,
        }}
        open={getAccessState}
        onClose={() => {
          dispatch(getAccessClose());
        }}
      />

      {/* Payment popups */}
      <SuccessPaymentPopup open={isPaymentSuccess} />
      <FailedPaymentPopup open={isPaymentFailed} />

      {/* trial subscription popup */}
      {(isBecomeAMemberWithVerified || shouldOfferTrials) && <TrialPopup {...{ dashboardData: landingData }} />}

      <SuccessSubscriptionPopup open={isSubscriptionActivated} />
    </Box>
  );
};

export default Landing3;
