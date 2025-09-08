import { Box, Grid2, Stack, Typography } from '@mui/material';
import { memo, useCallback, useEffect, useMemo } from 'react';
import CourseCard from '../../dashboard-card';
import { ICONS } from '@/assets/icons';
import { useTranslations } from 'next-intl';
import { isEmptyArray, isEmptyObject, videoURL } from '@/utils/helper';
import { useSelector } from 'react-redux';
import { SERVER_URL, DOMAIN } from '@/utils/constants';
import { routes } from '@/utils/constants/routes';
import { getAllContinueWatchHistoryCoursesData } from '@/store/features/dashboard.slice';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import moment from 'moment';
import { api } from '@/api';
import cookies from 'js-cookie'

const ContinueWatchingCourses = ({
  isBecomeAMemberWithVerified,
  handleStartFree,
  progress,
  className,
  country_code,
  language_id,
  user,
}: any) => {
  const t = useTranslations();

  const [fetchAllContinueWatchHistoryCoursesData] = useDispatchWithAbort(
    getAllContinueWatchHistoryCoursesData
  );

  const {
    continueWatchingCourse: { data: continueWatchCourseData, loading },
  } = useSelector(({ dashboard }: any) => dashboard);
  const { data: userPerchasedCoursesData, loading: purchaseLoading } = useSelector(({ user }: any) => user);

  const isCoursesDataLoading = useMemo(
    () => loading || purchaseLoading,
    [loading, purchaseLoading]
  );

  const continueWatchingCourseData = useMemo(() => {
    if (continueWatchCourseData && isEmptyArray(continueWatchCourseData))
      return [];
    return continueWatchCourseData?.map?.((watchingCourse: any) => {
      const { course_id, course } = watchingCourse || {};
      const { course_translations } = course || {};
      const { title, course_image, course_categories } =
        course_translations?.[0] || {};
      const { landing_pages, user_course_progresses } = course || {};
      const { author_image, rating, final_url } =
        landing_pages?.[0]?.landing_page_translations?.[0] || {};
      const { name: domainRedirection } =
        landing_pages?.[0]?.landing_name?.domain_detail?.domain || {};

      const completion_percentage =
        Number(
          user_course_progresses?.find(
            (item: any) => item.customer_id === user.id
          )?.completion_percentage
        ) || 0;

      let is_purchased = false;

      if (!isEmptyObject(userPerchasedCoursesData)) {
        const { user_orders } = userPerchasedCoursesData;
        is_purchased =
          user_orders?.some((order: any) =>
            order?.user_order_details?.some(
              (orderItem: any) => orderItem?.course_id === course_id
            )
          ) ?? false;
      }

      return {
        id: course_id,
        title,
        isContinueWatching: true,
        continueRedirectUrl: `${domainRedirection}${routes.private.course_details.replace(':slug', final_url)}`,
        category: course_categories
          ?.map((item: any) => item?.category?.name)
          ?.join(' , '),
        image: videoURL(course_image),
        instructor: {
          name: course?.user?.name,
          avatar: SERVER_URL + author_image,
        },
        rating,
        redirectionUrl:
          is_purchased || isBecomeAMemberWithVerified
            ? `${domainRedirection}${routes.private.course_details.replace(':slug', final_url)}`
            : `${domainRedirection}${routes.public.home}/${final_url}`,
        completion_percentage,
        is_purchased,
      };
    });
  }, [
    continueWatchCourseData,
    isBecomeAMemberWithVerified,
    user.id,
    userPerchasedCoursesData,
  ]);

  // Memoize the display condition for navigation buttons
  const showNavigation = useMemo(
    () => continueWatchingCourseData?.length > 3,
    [continueWatchingCourseData?.length]
  );

  const handleContinueWatchingCourse = useCallback(
    async (course_id: any) => {
      await api.processToWatch.getProcessToWatch({
        params: {
          user_id: user?.id,
          course_id,
          language_id: language_id,
        },
        data: {
          watch_time_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
      });
    },
    [language_id, user?.id]
  );

  useEffect(() => {
    if (
      language_id &&
      country_code &&
      user?.id &&
      fetchAllContinueWatchHistoryCoursesData
    ) {
      fetchAllContinueWatchHistoryCoursesData({
        params: {
          language_id,
          domain: DOMAIN,
          user_id: user?.id,
        },
        headers: {
          'req-from': country_code,
        },
        cookieToken: cookies.get('token') || ''
      });
    }
  }, [
    fetchAllContinueWatchHistoryCoursesData,
    language_id,
    user?.id,
    country_code,
  ]);

  // Memoize the course card props to prevent unnecessary re-renders
  const courseCardProps = useMemo(
    () => ({
      dashboardData: {
        isBecomeAMemberWithVerified,
        handleStartFree,
      },
      nextEl: '.user-continue-watching-courses-slider-swiper-button-next',
      prevEl: '.user-continue-watching-courses-slider-swiper-button-prev',
      progress,
      COURSES_DATA: continueWatchingCourseData,
      isLoading: isCoursesDataLoading,
    }),
    [
      isBecomeAMemberWithVerified,
      handleStartFree,
      progress,
      continueWatchingCourseData,
      isCoursesDataLoading,
    ]
  );

  return (
    <Grid2 className={className} size={{ xs: 12 }}>
      <Box px={{ xs: 2, sm: 0 }}>
        <Grid2 container spacing={{ xs: 2, sm: 4 }}>
          <Grid2 size={{ xs: 12 }}>
            <Stack
              direction='row'
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
                {!isEmptyArray(continueWatchingCourseData) ? <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: '28px', sm: '32px', fontWeight: 500 },
                    color: '#0E0E0E',
                  }}
                >
                  {t('continue_watching')}
                </Typography> : null}
              <Box
                className='navigation-wrapper'
                sx={{
                  display: {
                    xs: 'none',
                    sm: showNavigation ? 'flex!important' : 'none!important',
                  },
                  gap: 2,
                }}
              >
                <div
                  className='swiper-button-prev user-continue-watching-courses-slider-swiper-button-prev'
                  style={{ position: 'relative', top: '0px' }}
                >
                  <ICONS.KeyboardArrowLeft size={32} />
                </div>
                <div
                  className='swiper-button-next user-continue-watching-courses-slider-swiper-button-next'
                  style={{ position: 'relative', top: '0px' }}
                >
                  <ICONS.KeyboardArrowRight size={32} />
                </div>
              </Box>
            </Stack>
          </Grid2>
          {!isEmptyArray(continueWatchingCourseData) || isCoursesDataLoading ? (
            <Grid2 size={{ xs: 12 }}>
              <Box sx={{ position: 'relative' }}>
                <CourseCard
                  {...{
                    handleContinueWatchingCourse,
                    forContinueWatching: true,
                  }}
                  {...courseCardProps}
                />
              </Box>
            </Grid2>
          ) : null}
        </Grid2>
      </Box>
    </Grid2>
  );
};

export default memo(ContinueWatchingCourses);
