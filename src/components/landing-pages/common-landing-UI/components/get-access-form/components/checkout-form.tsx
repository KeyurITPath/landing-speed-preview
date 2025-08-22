import { useContext, useMemo, useState } from 'react';
import {
  Box,
  Divider,
  Grid2,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import {
  formatCurrency,
  getActualPrice,
  isEmptyObject,
  lineClamp,
  resolveUrl,
} from '@/utils/helper';
import CustomButton from '@/shared/button';
import { ICONS } from '@/assets/icons';
import { DOMAIN, ERROR_MESSAGES } from '@/utils/constants';
import { api } from '@/api';
import { routes } from '@/utils/constants/routes';
import Image from 'next/image';
import { AuthContext } from '@/context/auth-provider';
// import { pixel } from '@/assets/utils/pixel';
import { useTranslations } from 'next-intl';

const CheckoutForm = ({
  landingData,
  courseData,
  queryParams,
  utmData,
}: any) => {
  const [cartUpSalesOrders, setCartUpSalesOrder] = useState([]);
  const [loading, setLoading] = useState(false);

  const { upSaleCourses } = useSelector(({ course }: any) => course);

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useContext(AuthContext);

  const { currency } = useSelector(({ defaults }: any) => defaults);

  const mainCurrencyCode = currency.code;

  const t = useTranslations();

  const upSalesOrders = useMemo(() => {
    if (!upSaleCourses?.length) return [];

    const getPriceData = (course_prices: any) =>
      course_prices?.find(
        ({ is_upsale_price, currency }: any) =>
          is_upsale_price && currency?.name === mainCurrencyCode
      );

    return upSaleCourses
      .filter(({ course_prices }: any) => getPriceData(course_prices))
      .map(({ id, course_translation, course_prices }: any) => {
        const title = course_translation?.title;
        const image = resolveUrl(course_translation?.course_image);

        const priceData = getPriceData(course_prices);
        const priceAmount = priceData?.price || 0;
        const currencyCode = priceData?.currency?.name || mainCurrencyCode;

        const price = formatCurrency(priceAmount, currencyCode);
        const discount = course_translation?.course?.discount || 0;
        const actualPriceAmount = getActualPrice(priceAmount, discount);
        const actualPrice = formatCurrency(actualPriceAmount, currencyCode);

        return {
          id,
          title,
          image,
          price,
          actualPrice,
          stripeId: priceData?.stripe_price_id,
          priceAmount,
        };
      })
      .filter(
        (upsale: any) =>
          !cartUpSalesOrders.some(
            (cartItem: any) =>
              upsale.id === cartItem.id && upsale.name === cartItem.name
          )
      );
  }, [cartUpSalesOrders, mainCurrencyCode, upSaleCourses]);

  const coursePrice = useMemo(() => {
    const defaultPrice = courseData?.course_prices?.[0];
    const amount = defaultPrice?.price;
    const currencyCode = defaultPrice?.currency?.name;

    return formatCurrency(amount, currencyCode);
  }, [courseData?.course_prices]);

  const totalPrice = useMemo(() => {
    const defaultPrice = courseData?.course_prices?.[0];
    const courseAmount = defaultPrice?.price;
    const currencyCode = defaultPrice?.currency?.name;

    const totalAmount =
      courseAmount +
      cartUpSalesOrders.reduce(
        (sum, item: any) => sum + item?.priceAmount || 0,
        0
      );

    return formatCurrency(totalAmount, currencyCode);
  }, [cartUpSalesOrders, courseData?.course_prices]);

  const handleAddToOrder = (course: any) => {
    setCartUpSalesOrder([...cartUpSalesOrders, course]);
  };

  const removeFromOrder = (idToDelete: any) => {
    const newCartOrders = cartUpSalesOrders.filter(
      ({ id }) => id !== idToDelete
    );
    setCartUpSalesOrder(newCartOrders);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      let success_url = '';

      const { origin, pathname } = window.location;

      if (user?.is_verified) {
        success_url = `${origin}${pathname}?payment=success`;
      } else {
        sessionStorage.setItem('hasSalesFlowAccess', true);
        const queryString = new URLSearchParams(queryParams).toString();
        success_url = `${origin}${routes.public.email_verification}?payment=success${queryString ? `&${queryString}` : ''}`;
      }

      const cancel_url = `${origin}${pathname}?payment=failed`;

      const upsaleIds = cartUpSalesOrders.map(({ stripeId }) => stripeId);

      const data = {
        stripe_price_id: courseData?.course_prices?.[0]?.stripe_price_id,
        selected_upsale_price_ids: upsaleIds || [],
        user_id: user?.id,
        success_url,
        cancel_url,
        domain: DOMAIN,
        final_url: landingData?.final_url,
        ...queryParams,
      };

      const res = await api.getAccess.orderCheckout({ data });
      if (res?.data?.data?.checkoutUrl) {
        // await pixel.initial_checkout({
        //     userId: user?.id,
        //     ...(upsaleIds?.length ? { content_ids: upsaleIds } : {}),
        //     ...(!isEmptyObject(utmData) ? { utmData } : {})
        // });
        window.location.href = res?.data?.data?.checkoutUrl;
      }
    } catch (error) {
      setLoading(false);
      enqueueSnackbar((error as Error)?.message || ERROR_MESSAGES.common, {
        variant: 'error',
      });
    }
  };

  return (
    <Stack sx={{ gap: { xs: 2, sm: 4 } }}>
      <Stack sx={{ gap: 2 }}>
        <Typography
          variant='h5'
          sx={{ color: 'common.black', fontWeight: 500 }}
        >
          {t('unlock_special_offer')}
        </Typography>
        <Typography
          variant='body2'
          sx={{ color: 'common.black', fontWeight: 500 }}
        >
          {t('course_at_discount')}
        </Typography>
      </Stack>
      <Divider
        sx={{
          borderStyle: 'dashed',
          borderColor: '#dfdfdf',
        }}
      />
      <Stack sx={{ gap: 2 }}>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: 35,
            gap: 2,
          }}
        >
          <Typography
            variant='body1'
            sx={{ color: 'common.black', fontWeight: 500 }}
          >
            {landingData?.header}
          </Typography>
          <Typography
            variant='body1'
            sx={{ color: 'common.black', fontWeight: 500, textWrap: 'nowrap' }}
          >
            {coursePrice}
          </Typography>
        </Stack>
        {cartUpSalesOrders.map(({ title, price, id }) => (
          <Stack
            key={id}
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography
              variant='body1'
              sx={{ color: 'common.black', fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Stack
              sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5 }}
            >
              <Typography
                variant='body1'
                sx={{
                  color: 'common.black',
                  fontWeight: 500,
                  textWrap: 'nowrap',
                }}
              >
                {price}
              </Typography>
              <IconButton
                size='small'
                sx={{ color: '#BFBFBF', fontSize: 25, mr: -1 }}
                onClick={() => removeFromOrder(id)}
              >
                <ICONS.CloseCircleOutline />
              </IconButton>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Divider
        sx={{
          borderStyle: 'dashed',
          borderColor: '#dfdfdf',
        }}
      />
      {upSalesOrders?.length !== 0 && (
        <Grid2
          container
          spacing={{ xs: 1.5 }}
          sx={{ flexWrap: 'nowrap', pb: 1 }}
          className='custom-scrollbar'
        >
          {upSalesOrders.map(
            ({ title, image, price, actualPrice, id, ...rest }: any) => (
              <Grid2 key={id} size={{ xs: 4 }} sx={{ minWidth: '160px' }}>
                <Stack
                  sx={{
                    height: '100%',
                    gap: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack sx={{ gap: 0.4, position: 'relative' }}>
                    <Image
                      width={165}
                      height={92}
                      src={image}
                      alt={title}
                      style={{
                        objectFit: 'cover',
                        aspectRatio: '16/9',
                        borderRadius: '8px',
                        width: '100%',
                      }}
                    />
                    <Typography variant='body2' sx={{ ...lineClamp(2) }}>
                      {title}
                    </Typography>
                    <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                      {price}{' '}
                      <Box
                        component='span'
                        sx={{
                          textDecoration: 'line-through',
                          color: '#757575',
                          fontSize: 16,
                          fontWeight: 400,
                        }}
                      >
                        {actualPrice}
                      </Box>
                    </Typography>
                  </Stack>
                  <CustomButton
                    size='small'
                    onClick={() =>
                      handleAddToOrder({ title, price, id, ...rest })
                    }
                  >
                    {t('add_to_order')}
                  </CustomButton>
                </Stack>
              </Grid2>
            )
          )}
        </Grid2>
      )}
      <Typography
        variant='body1'
        sx={{ color: 'common.black', fontWeight: 500, textAlign: 'right' }}
      >
        {t('total')}: {totalPrice}
      </Typography>
      <Divider
        sx={{
          borderStyle: 'dashed',
          borderColor: '#dfdfdf',
        }}
      />
      <CustomButton size='large' {...{ loading }} onClick={onSubmit}>
        {t('proceed_to_checkout')}
      </CustomButton>
    </Stack>
  );
};

export default CheckoutForm;
