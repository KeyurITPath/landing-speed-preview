import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchUser } from '@/store/features/user.slice';
import PopUpModal from '@/shared/pop-up-modal';
import { AuthContext } from '@/context/auth-provider';
import { ICONS } from '@/assets/icons';
import { isEmptyObject } from '@/utils/helper';
import { pixel } from '@/utils/pixel';
import { gtm } from '@/utils/gtm';
import cookies from 'js-cookie';

const SuccessPaymentPopup = ({ open }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const { user } = useContext(AuthContext);

  const [fetchUserData] = useDispatchWithAbort(fetchUser);
  const { data } = useSelector(({ user }: any) => user);

  const country_code = cookies.get('country_code') || '';

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params?.delete('payment');
    params?.delete('token');
    const remainingParams = params?.toString();
    router.replace(
      `${pathname}${remainingParams ? `?${remainingParams}` : ''}`
    );
  };

  useEffect(() => {
    if (open && user?.id && fetchUserData) {
      fetchUserData({
        params: { user_id: user?.id },
        headers: { 'req-from': country_code },
        cookieToken: cookies.get('token'),
      });
    }
  }, [open, fetchUserData, user?.id, country_code]);

  const currency = useMemo(
    () =>
      data?.user_orders?.[0]?.user_order_details?.[0]?.course_price?.currency
        ?.name || 'USD',
    [data]
  );

  const totalPrice = useMemo(
    () => data?.user_orders?.[0]?.payment_histories?.[0]?.total_amount || 0,
    [data]
  );

  const course_content = data?.user_orders?.[0]?.user_order_details?.map(
    (item: any) => ({
      id: item?.course_id,
      quantity: 1,
      item_price: item?.course_price?.price || 0,
    })
  );

  const courseAmount = data?.user_orders?.[0]?.user_order_details
    ?.filter(({ is_upsale }: any) => !is_upsale)
    ?.reduce(
      (sum: any, { course_price }: any) => sum + course_price?.price || 0,
      0
    );

  const upSaleAmount = data?.user_orders?.[0]?.user_order_details
    ?.filter(({ is_upsale }: any) => is_upsale)
    ?.reduce(
      (sum: any, { course_price }: any) => sum + course_price?.price || 0,
      0
    );

  const isExistUpsale = data?.user_orders?.[0]?.user_order_details?.some(
    ({ is_upsale }: any) => is_upsale
  );

  const metaParams = useMemo(() => {
    return {
      content_type: 'course',
      userId: data?.id,
      content_ids: course_content?.map((item: any) => item?.id) || [],
      currency: currency,
      contents: course_content,
      value: totalPrice,
      total_amount: totalPrice,
    };
  }, [course_content, currency, data?.id, totalPrice]);

  const utmData = useMemo(() => {
    const utmSources = data?.user_orders?.[0]?.payment_histories?.[0] || {};
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
  }, [data?.user_orders]);

  // 🔑 Flag to prevent duplicate pixel.purchase firing
  const hasFired = useRef(false);

  useEffect(() => {
    if (data?.id && open && !hasFired.current) {
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

    // reset flag when popup closes
    if (!open) {
      hasFired.current = false;
    }
  }, [
    courseAmount,
    data?.id,
    isExistUpsale,
    metaParams,
    open,
    upSaleAmount,
    utmData,
  ]);

  return (
    <PopUpModal
      {...{ open }}
      onClose={handleClose}
      icon={ICONS.CircleCheck}
      message={t('payment_successful')}
      successButton={{
        text: t('validation_okay_button'),
        onClick: handleClose,
      }}
    />
  );
};

export default SuccessPaymentPopup;
