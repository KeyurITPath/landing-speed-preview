'use client';

import { useSelector } from 'react-redux';
import UpsaleCourses from '@/components/landing-pages/upsale-courses';
import cookies from 'js-cookie';
import { useContext, useEffect, useMemo } from 'react';
import { AuthContext } from '@/context/auth-provider';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchUser } from '@/store/features/user.slice';

export default function UpsellCoursesPage() {
  // Get course data from Redux state (populated from landing page)
  const { data: courseData } = useSelector(({ course }: any) => course);
  const { currency } = useSelector(({ defaults }: any) => defaults);
  const { user } = useContext(AuthContext);
  const { data: userData } = useSelector(
    ({ user: userState }: any) => userState
  );

  // Get landing page name from cookie (stored during landing page visit)
  const landingPageName = useMemo(() => {
    try {
      // First try to get from the Redux courseData
      if (courseData?.landing_page_name) {
        return courseData.landing_page_name;
      }
      // Then try from cookie
      const courseDataCookie = cookies.get('course_data');
      if (courseDataCookie) {
        const parsedData = JSON.parse(courseDataCookie);
        return parsedData?.landing_page_name || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }, [courseData]);

  // Dispatch action to fetch user data
  const [fetchUserData] = useDispatchWithAbort(fetchUser);

  // Fetch user data on mount to get order history
  useEffect(() => {
    if (user?.id && fetchUserData) {
      const country_code = cookies.get('country_code') || '';
      fetchUserData({
        params: { user_id: user?.id },
        headers: { 'req-from': country_code },
        cookieToken: cookies.get('token'),
      });
    }
  }, [user?.id, fetchUserData]);

  // Fallback: Get course data from cookies if Redux state is empty
  const courseDataFromCookie =
    courseData && Object.keys(courseData).length > 0
      ? courseData
      : JSON.parse(cookies.get('course_data') || '{}');

  // Extract currency from cookie
  const currencyFromCookie = useMemo(() => {
    if (courseDataFromCookie?.currency_id && courseDataFromCookie?.currency_name) {
      return {
        id: courseDataFromCookie.currency_id,
        name: courseDataFromCookie.currency_name,
      };
    }
    return null;
  }, [courseDataFromCookie]);

  // Use cookie data as fallback with proper structure
  const courseDataFromCookieStructured =
    courseDataFromCookie && Object.keys(courseDataFromCookie).length > 0
      ? {
          course: {
            id: courseDataFromCookie.id,
            course_translations: [
              {
                title: courseDataFromCookie.course_title,
              },
            ],
          },
          landing_page_translations: [
            {
              language_id: courseDataFromCookie.language_id,
            },
          ],
          final_url: courseDataFromCookie.slug,
        }
      : null;

  const courseDataFromOrder = useMemo(() => {
    if (userData?.user_orders?.[0]?.user_order_details?.[0]) {
      const orderDetail = userData.user_orders[0].user_order_details[0];
      return {
        course: {
          id: orderDetail.course_id,
          course_prices: [orderDetail.course_price],
          course_translations: [
            {
              title: orderDetail?.course_translation?.title,
            },
          ],
        },
        landing_page_translations: [
          {
            language_id: orderDetail?.language_id,
          },
        ],
        final_url:
          courseDataFromCookieStructured?.final_url ||
          orderDetail?.course?.landing_pages?.[2]
            ?.landing_page_translations?.[0]?.final_url ||
          orderDetail?.course?.landing_pages?.[0]
            ?.landing_page_translations?.[0]?.final_url,
      };
    }
    return null;
  }, [courseDataFromCookieStructured?.final_url, userData.user_orders]);
  // Extract currency from order history
  const currencyFromOrder = useMemo(() => {
    if (
      userData?.user_orders?.[0]?.user_order_details?.[0]?.course_price
        ?.currency
    ) {
      return userData.user_orders[0].user_order_details[0].course_price
        .currency;
    }
    return null;
  }, [userData]);
  // Use the best available data source
  const finalCourseData = courseDataFromOrder || courseDataFromCookieStructured;
  const finalCurrency = currencyFromOrder || currencyFromCookie || currency;

  return (
    <UpsaleCourses
      courseData={finalCourseData}
      currency={finalCurrency}
      landingPageName={landingPageName}
    />
  );
}
