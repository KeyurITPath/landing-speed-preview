import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useDispatchWithAbort from '@/hooks/use-dispatch-with-abort';
import { fetchUser } from '@/store/features/user.slice';
import PopUpModal from '@/shared/pop-up-modal';
import { AuthContext } from '@/context/auth-provider';
import { ICONS } from '@/assets/icons';
import { isEmptyObject } from '@/utils/helper';
import { pixel } from '@/utils/pixel';
// import { gtm } from '../../assets/utils/gtm';

const SuccessPaymentPopup = ({ open }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const { user } = useContext(AuthContext);

  const [fetchUserData] = useDispatchWithAbort(fetchUser);
  const { data } = useSelector(({ user }: any) => user);
  const { country } = useSelector(({ defaults }: any) => defaults);

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
        headers: { 'req-from': country?.country_code },
      });
    }
  }, [open, fetchUserData, user?.id, country?.country_code]);

  useEffect(() => {
    if (data?.id && open) {
      const [orderData] = data?.user_orders || [];

      const utmSources = orderData?.payment_histories?.[0] || {};
      const utm_campaign = utmSources?.utm_campaign || '';
      const utm_source = utmSources?.utm_source || '';
      const utm_medium = utmSources?.utm_medium || '';
      const utm_content = utmSources?.utm_content || '';
      const utm_term = utmSources?.utm_term || '';
      const fbclid = utmSources?.fbclid || '';
      const gclid = utmSources?.gclid || '';
      const ttclid = utmSources?.ttclid || '';

      const utmData = {
        ...(utm_campaign && { utm_campaign }),
        ...(utm_source && { utm_source }),
        ...(utm_medium && { utm_medium }),
        ...(utm_content && { utm_content }),
        ...(utm_term && { utm_term }),
        ...(fbclid && { fbclid }),
        ...(gclid && { gclid }),
        ...(ttclid && { ttclid }),
      };

      const total_amount = orderData?.payment_histories?.[0]?.total_amount || 0;

      const courseAmount = orderData?.user_order_details
        ?.filter(({ is_upsale }: any) => !is_upsale)
        ?.reduce(
          (sum: any, { course_price }: any) => sum + course_price?.price || 0,
          0
        );

      const upSaleAmount = orderData?.user_order_details
        ?.filter(({ is_upsale }: any) => is_upsale)
        ?.reduce(
          (sum: any, { course_price }: any) => sum + course_price?.price || 0,
          0
        );

      const isExistUpsale = orderData?.user_order_details?.some(
        ({ is_upsale }: any) => is_upsale
      );

      // gtm.ecommerce.purchase({ value: courseAmount });
      // if (isExistUpsale) {
      //     gtm.ecommerce.upsale({ value: upSaleAmount });
      // }
      pixel.purchase({
          total_amount,
          userId: user?.id,
          currency: orderData?.user_order_details?.[0]?.course_price?.currency?.name || 'USD',
          ...(!isEmptyObject(utmData) && { utmData })
      });
    }
  }, [data, open, user?.id]);

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
