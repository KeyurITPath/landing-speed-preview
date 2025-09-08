'use client';
import { Box, Container, Grid2 } from '@mui/material';
import useCourseDetails from './use-course-details';
import Loader from '@/components/course-details-component/loader';
import NoData from '@/components/course-details-component/no-data';
import RecommendedCourses from '@/components/course-details-component/recommended-courses';
import PopularCourseByCategories from '@/components/course-details-component/popular-course-by-categories';
import TrialPopup from '@/components/trial-popup';
import SuccessSubscriptionPopup from '@/components/success-subscription-popup';
import TrialSideBanner from '@/components/course-details-component/trial-side-banner';
import CourseDetailsContent from '@/components/course-details-component/course-details-content';
import VideoContainer from '@/components/course-details-component/video-container';
import { useMemo } from 'react';
import { getDeviceType } from '@/utils/helper';
import { useCookieSync } from '@/hooks/use-cookie-sync';

const CourseDetailContainer = ({
  language_id,
  user,
  country_code,
  domainDetails,
  slug,
  languages,
}: any) => {
      // Sync cookies with server-side values
  useCookieSync(language_id, country_code, languages);
  const courseDetailsData = useCourseDetails({
    language_id,
    user,
    country_code,
    domainDetails,
    slug,
    languages,
  });

  const {
    loading,
    isUserPurchasedCourse,
    isSubscriptionActivated,
    isBecomeAMemberWithVerified,
    isBecomeVerifiedAndSubscribed,
    transformDataForTrialSideBanner,
    shouldOfferTrials,
  } = courseDetailsData || {};

  const shouldShowTrialSideBanner = useMemo(
    () =>
      isBecomeAMemberWithVerified &&
      transformDataForTrialSideBanner?.status === 'on' &&
      !user?.is_user_purchased_trial,
    [
      isBecomeAMemberWithVerified,
      transformDataForTrialSideBanner?.status,
      user?.is_user_purchased_trial,
    ]
  );

  const { status } = transformDataForTrialSideBanner || {};

  const isMobile = useMemo(() => getDeviceType() === 'mobile', []);

  if (loading) return <Loader />;
  if (!isUserPurchasedCourse && !isBecomeVerifiedAndSubscribed)
    return <NoData {...courseDetailsData} />;


    return (
        <>
            {isMobile ? (
                <Box sx={{ width: '100%', paddingBottom: { xs: 2, sm: 3 } }}>
                    <Grid2 container spacing={{ xs: 2, sm: 6 }}>
                        <VideoContainer {...{ courseDetailsData: { ...courseDetailsData, domainDetails, user } }} />
                        <Container maxWidth="lg">
                            <Grid2 size={{ xs: 12 }}>
                                <Grid2 container spacing={status === 'on' ? 4 : 0}>
                                    <Grid2
                                        size={{
                                            xs: 12,
                                            sm: status === 'on' ? 8 : 12
                                        }}
                                    >
                                        <CourseDetailsContent {...{ courseDetailsData }} />
                                    </Grid2>
                                    {shouldShowTrialSideBanner && (
                                        <Grid2 size={{ xs: 12, sm: 4 }}>
                                            <TrialSideBanner
                                                {...{ dashboardData: courseDetailsData }}
                                            />
                                        </Grid2>
                                    )}
                                </Grid2>
                            </Grid2>
                        </Container>
                        <RecommendedCourses
                            {...{ dashboardData: courseDetailsData, progress: false }}
                        />
                        <PopularCourseByCategories
                            {...{ dashboardData: courseDetailsData, progress: false }}
                        />
                    </Grid2>
                </Box>
            ) : (
                <Container maxWidth="lg" sx={{ width: '100%', paddingY: { xs: 2, sm: 3 } }}>
                    <Grid2 container spacing={{ xs: 2, sm: 6 }}>
                         <VideoContainer {...{ courseDetailsData: { ...courseDetailsData, domainDetails, user } }} />
                        <Grid2 size={{ xs: 12 }}>
                            <Grid2 container spacing={status === 'on' ? 4 : 0}>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        sm: status === 'on' ? 8 : 12
                                    }}
                                >
                                    <CourseDetailsContent {...{ courseDetailsData }} />
                                </Grid2>
                                {shouldShowTrialSideBanner && (
                                    <Grid2 size={{ xs: 12, sm: 4 }}>
                                        <TrialSideBanner
                                            {...{ dashboardData: courseDetailsData }}
                                        />
                                    </Grid2>
                                )}
                            </Grid2>
                        </Grid2>
                        <RecommendedCourses
                            {...{ dashboardData: courseDetailsData, progress: false }}
                        />
                        <PopularCourseByCategories
                            {...{ dashboardData: courseDetailsData, progress: false }}
                        />
                    </Grid2>
                </Container>
            )}
            {(isBecomeAMemberWithVerified || shouldOfferTrials) && (
                <TrialPopup {...{ dashboardData: courseDetailsData }} />
            )}
            <SuccessSubscriptionPopup open={isSubscriptionActivated} />
        </>
    );
};

export default CourseDetailContainer;
