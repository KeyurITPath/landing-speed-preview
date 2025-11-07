import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
// import { countries } from 'countries-list';
import { profileUpdateValidation } from '@/utils/validations';
import { AGE_RANGE, DOMAIN, GENDERS } from '@/utils/constants';
import { api } from '@/api';
import { AuthContext } from '@/context/auth-provider';
import useAsyncOperation from '@/hooks/use-async-operation';
import { routes } from '@/utils/constants/routes';
import { decodeToken, decrypt, isEmptyObject } from '@/utils/helper';
import { updateUser } from '@/store/features/auth.slice';
import { useTranslations } from 'next-intl';
import useSocket from '@/hooks/use-socket';
import cookies from 'js-cookie';
import { getAllLanguages } from '@/store/features/defaults.slice';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchUser } from '@/store/features/user.slice';
import { pixel } from '@/utils/pixel';
import { gtm } from '@/utils/gtm';

const useProfileUpdateForm = ({ setActiveTab, userData }: any) => {
  const { user, setToken } = useContext(AuthContext);
  const [fetchAllLanguages] = useDispatchWithAbort(getAllLanguages);
  const [fetchUserData] = useDispatchWithAbort(fetchUser);
  const { updateSocketOnLogin } = useSocket();
  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations();

  const initialValues = {
    first_name: userData?.first_name || '',
    last_name: userData?.last_name || '',
    phone: '',
    // location: '',
    age: '',
    gender: '',
  };

  const { enqueueSnackbar } = useSnackbar();

  const country_code = cookies.get('country_code') || '';

  // State to track if profile is completed (trigger for fetching user data)
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [selectedUpsaleCourses, setSelectedUpsaleCourses] = useState([]);
  // 🔑 Flag to prevent duplicate pixel.purchase firing
  const hasFired = useRef(false);

  useEffect(() => {
    if (fetchAllLanguages) {
      fetchAllLanguages({});
    }
  }, [fetchAllLanguages]);

  const { languages } = useSelector(({ defaults }: any) => defaults);
  const { data: languagesData } = languages || {};

  const { data: userOrderData } = useSelector(({ user }: any) => user);
  const { data: courseData, upSaleCourses } = useSelector(
    ({ course }: any) => course
  );
  const storedUpsaleIds = sessionStorage.getItem('selectedUpsaleIds');

  const selectedLanguage = languagesData?.find(
    (lang: any) => Number(lang.id) === Number(cookies.get('language_id'))
  );

  // Get landing page name from Redux or cookie
  const landingPageName = useMemo(() => {
    try {
      // First try to get from Redux courseData
      if (courseData?.landing_page_name) {
        return courseData.landing_page_name;
      }
      // Then try from cookie
      const courseDataCookie = cookies.get('course_data');
      if (courseDataCookie) {
        const parsedData = JSON.parse(courseDataCookie);
        return parsedData?.landing_page_name?.name || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }, [courseData]);

  // Only fire pixel for landing1
  const shouldFirePixel =
    landingPageName === 'landing1' || landingPageName === 'landing2';

  const plainPassword = useMemo(() => {
    return decrypt(userData?.passwordforUI);
  }, [userData?.passwordforUI]);

  const currencyName = useMemo(
    () =>
      userOrderData?.user_orders?.[0]?.user_order_details?.[0]?.course_price
        ?.currency?.name || 'USD',
    [userOrderData]
  );

  useEffect(() => {
    let selectedIds = [];
    if (storedUpsaleIds && storedUpsaleIds.length > 0) {
      selectedIds = JSON.parse(storedUpsaleIds || '[]');
    }
    const courses = upSaleCourses
      .map((course: any) => {
        const priceData = course.course_prices?.find(
          ({ is_upsale_price, currency, stripe_price_id }: any) =>
            is_upsale_price &&
            currency?.name === currencyName &&
            selectedIds.includes(stripe_price_id)
        );
        if (!priceData) return null;

        return {
          id: course.id,
          priceAmount: priceData?.price || 0,
          stripeId: priceData?.stripe_price_id,
        };
      })
      .filter((item: any) => item !== null);
    setSelectedUpsaleCourses(courses);
  }, [currencyName, storedUpsaleIds, upSaleCourses]);

  // Sum all payment_histories total_amount where payment_status is 'paid'
  const totalPrice = useMemo(() => {
    const paymentHistories =
      userOrderData?.user_orders?.[0]?.payment_histories || [];
    return paymentHistories
      .filter((history: any) => history?.payment_status === 'paid')
      .reduce(
        (sum: number, history: any) => sum + (history?.total_amount || 0),
        0
      );
  }, [userOrderData]);

  const course_content = useMemo(
    () =>
      userOrderData?.user_orders?.[0]?.user_order_details?.map((item: any) => ({
        id: item?.course_id,
        quantity: 1,
        item_price: item?.course_price?.price || 0,
      })) || [],
    [userOrderData]
  );

  const upsaleContents = useMemo(
    () =>
      selectedUpsaleCourses?.map((item: any) => ({
        id: item?.id,
        quantity: 1,
        item_price: item?.priceAmount || 0,
      })) || [],
    [selectedUpsaleCourses]
  );

  const courseAmount = userOrderData?.user_orders?.[0]?.user_order_details
    ?.filter(({ is_upsale }: any) => !is_upsale)
    ?.reduce(
      (sum: any, { course_price }: any) => sum + course_price?.price || 0,
      0
    );
  const upSaleAmount = userOrderData?.user_orders?.[0]?.user_order_details
    ?.filter(({ is_upsale }: any) => is_upsale)
    ?.reduce(
      (sum: any, { course_price }: any) => sum + course_price?.price || 0,
      0
    );
  const isExistUpsale =
    userOrderData?.user_orders?.[0]?.user_order_details?.some(
      ({ is_upsale }: any) => is_upsale
    );

  const contentIds = useMemo(() => {
    return [
      ...(course_content?.map((item: any) => item?.id) || []),
      ...(selectedUpsaleCourses?.map((item: any) => item?.id) || []),
    ];
  }, [course_content, selectedUpsaleCourses]);

  const totalCoursePrice = useMemo(() => {
    return (
      course_content?.reduce(
        (sum: number, item: any) => sum + item?.item_price || 0,
        0
      ) +
      upsaleContents?.reduce(
        (sum: number, item: any) => sum + item?.item_price || 0,
        0
      )
    );
  }, [course_content, upsaleContents]);

  const metaParams = useMemo(() => {
    return {
      content_type: 'course',
      userId: userOrderData?.id,
      content_ids: contentIds,
      currency: currencyName,
      contents: [...course_content, ...upsaleContents],
      value: totalCoursePrice,
      total_amount: totalCoursePrice,
    };
  }, [userOrderData?.id, contentIds, currencyName, course_content, upsaleContents, totalCoursePrice]);

  const utmData = useMemo(() => {
    const utmSources =
      userOrderData?.user_orders?.[0]?.payment_histories?.[0] || {};
    const utm_campaign = utmSources?.utm_campaign || '';
    const utm_source = utmSources?.utm_source || '';
    const utm_medium = utmSources?.utm_medium || '';
    const utm_content = utmSources?.utm_content || '';
    const utm_term = utmSources?.utm_term || '';
    const fbclid = utmSources?.fbclid || '';
    const gclid = utmSources?.gclid || '';
    const ttclid = utmSources?.ttclid || '';
    return {
      ...(utm_campaign && { utm_campaign }),
      ...(utm_source && { utm_source }),
      ...(utm_medium && { utm_medium }),
      ...(utm_content && { utm_content }),
      ...(utm_term && { utm_term }),
      ...(fbclid && { fbclid }),
      ...(gclid && { gclid }),
      ...(ttclid && { ttclid }),
    };
  }, [userOrderData?.user_orders]);

  // Fetch user data when profile is completed AND only for landing1
  useEffect(() => {
    if (isProfileCompleted && user?.id && fetchUserData && shouldFirePixel) {
      fetchUserData({
        params: { user_id: user?.id },
        headers: { 'req-from': country_code },
        cookieToken: cookies.get('token'),
      });
    }
  }, [
    isProfileCompleted,
    fetchUserData,
    user?.id,
    country_code,
    shouldFirePixel,
  ]);

  const [onSubmit, loading] = useAsyncOperation(async (values: any) => {
    const { phone, ...restValues } = values;
    const updateData = {
      ...restValues,
      phone: phone ? '+' + phone : null,
      is_verified: true,
    };
    await api.user.update({
      data: updateData,
      params: { user_id: user?.id },
      cookieToken: cookies.get('token'),
    });
    const { first_name, last_name, age } = values;

    await api.getAccess.openAccess({
      data: {
        email: userData?.email,
        first_name,
        last_name,
        age,
        user_language: selectedLanguage?.name,
        domain: DOMAIN,
      },
    });

    const response = await api.auth.login({
      auth: {
        username: userData?.email,
        password: plainPassword,
      },
    });
    if (response?.data) {
      const token = response?.data?.data?.token;
      if (token) {
        setToken(token);
        updateSocketOnLogin(token);
      }
      const decodeData = decodeToken(token);
      cookies.set(
        'is_cancellation_request',
        decodeData?.is_cancellation_request ? 'true' : 'false'
      );
      dispatch(
        updateUser({
          token,
          activeUI: '',
          isLoggedIn: true,
          ...user,
          ...decodeData,
        })
      );

      // Trigger useEffect to fetch user data (similar to success popup pattern)
      setIsProfileCompleted(true);

      enqueueSnackbar('Data submitted successfully.', { variant: 'success' });
      resetForm();

      // Clear onboarding redirection cookie when profile is completed
      cookies.remove('onboarding_redirection_url', { path: '/' });

      if (decodeData?.is_verified) {
        setActiveTab(2);
      } else {
        router.push(routes.public.home);
      }
    }
  });

  const {
    errors,
    values,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema: profileUpdateValidation(t),
    enableReinitialize: true,
    onSubmit,
  });

  useEffect(() => {
    const phoneValue = userData?.phone || '';
    const phoneWithoutPrefix = phoneValue.startsWith('+')
      ? phoneValue.substring(1)
      : phoneValue;
    setValues(prev => ({
      ...prev,
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      phone: phoneWithoutPrefix,
    }));
  }, [userData, setValues]);

  // Fire pixel.purchase when user order data is available (only once and only for landing1)
  useEffect(() => {
    if (
      userOrderData?.id &&
      isProfileCompleted &&
      !hasFired.current &&
      shouldFirePixel
    ) {
      gtm.ecommerce.purchase({ value: courseAmount });
      if (isExistUpsale) {
        gtm.ecommerce.upsale({ value: upSaleAmount });
      }
      pixel.purchase({
        ...metaParams,
        ...(!isEmptyObject(utmData) && { utmData }),
      });

      hasFired.current = true; // prevent duplicate firing
    }

    // Reset flag when profile completion state resets
    if (!isProfileCompleted) {
      hasFired.current = false;
    }
  }, [
    courseAmount,
    isExistUpsale,
    isProfileCompleted,
    metaParams,
    shouldFirePixel,
    upSaleAmount,
    userOrderData?.id,
    utmData,
  ]);

  // const countriesData = useMemo(() => {
  //   return Object.values(countries).map(({ name }) => ({
  //     label: name,
  //     value: name,
  //   }));
  // }, []);

  const formData = useMemo(
    () => [
      {
        id: 'first_name',
        name: 'first_name',
        value: values.first_name,
        placeholder: t('your_first_name'),
        handleChange,
        handleBlur,
        error: touched.first_name && errors.first_name,
        type: 'text',
      },
      {
        id: 'last_name',
        name: 'last_name',
        value: values.last_name,
        placeholder: t('your_last_name'),
        handleChange,
        handleBlur,
        error: touched.last_name && errors.last_name,
        type: 'text',
      },
      {
        id: 'phone',
        name: 'phone',
        value: values.phone,
        placeholder: t('enter_phone'),
        handleChange,
        handleBlur,
        error: touched.phone && errors.phone,
        type: 'phone',
      },
      // {
      //   id: 'location',
      //   name: 'location',
      //   value: values.location,
      //   placeholder: t('country'),
      //   handleChange,
      //   handleBlur,
      //   error: touched.location && errors.location,
      //   type: 'autocomplete',
      //   options: countriesData,
      // },
      {
        id: 'age',
        name: 'age',
        value: values.age,
        placeholder: t('your_age'),
        handleChange,
        handleBlur,
        // error: touched.age && errors.age,
        type: 'autocomplete',
        options: [
          { value: 'under 18', label: t('age_range.label') },
          ...AGE_RANGE,
        ],
      },
      {
        id: 'gender',
        name: 'gender',
        value: values.gender,
        handleChange,
        handleBlur,
        // error: touched.gender && errors.gender,
        type: 'radio',
        options: GENDERS.map(gender => ({
          ...gender,
          label: t(gender.label),
        })),
        row: true,
      },
    ],
    [errors, handleBlur, handleChange, touched, values, t]
  );

  return { handleSubmit, formData, loading };
};

export default useProfileUpdateForm;
