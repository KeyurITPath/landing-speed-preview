import { useEffect, useMemo } from 'react';
import {
  Box,
  CircularProgress,
  Grid2,
  IconButton,
  Link,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { ICONS } from '@/assets/icons';
import CustomButton from '@/shared/button';
import useClipboard from '@/hooks/use-clipboard';
import { IMAGES } from '@/assets/images';
import { decrypt } from '@/utils/helper';
import { useTranslations } from 'next-intl';
import { routes } from '../../../../utils/constants/routes';
import Image from 'next/image';

const CredentialsCard = styled(Stack)(() => ({
  border: '1px solid #E5E5E5',
  borderRadius: 12,
  padding: '10px 25px',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ProductsCard = styled(Stack)(() => ({
  border: '1px solid #f1f1f1',
  borderRadius: 12,
  padding: '18px 25px',
  flexDirection: 'row',
  gap: '15px',
  boxShadow: '10px 10px 90px 0px #8080801A',
}));

const CredentialsForm = ({ setActiveTab, SUPPORT_MAIL, userData }: any) => {
  const [copyEmail, emailLoading, emailIsCopied] = useClipboard();
  const [copyPassword, passwordLoading, passwordIsCopied] = useClipboard();
  const router = useRouter();
  const t = useTranslations();

  const plainPassword = useMemo(() => {
    return decrypt(userData?.passwordforUI);
  }, [userData?.passwordforUI]);

  const isFreeTrial = useMemo(() => {
    return (
      userData?.subscription_purchase_histories?.find(
        ({ is_trial }: any) => is_trial
      )?.is_trial || false
    );
  }, [userData?.subscription_purchase_histories]);

  const trailDays = useMemo(() => {
    return (
      userData?.subscription_purchase_histories?.find(
        ({ is_trial }: any) => is_trial
      )?.subscription_plan?.trial_days || 7
    );
  }, [userData?.subscription_purchase_histories]);

  const orderHistory = useMemo(() => {
    return (
      userData?.user_orders?.[0]?.user_order_details?.map(
        ({ id, course_translation }: any) => ({
          id,
          title: course_translation?.title,
        })
      ) || []
    );
  }, [userData]);

  useEffect(() => {
    if (!userData?.id) {
      router.push(routes.public.home);
    }
  }, [userData?.id, router]);

  return (
    <>
      <Typography variant='h4'>{t('thank_you')}</Typography>
      <Typography variant='body2'>
        {t('purchase_message')}
        {':'}
      </Typography>
      {!userData?.id ? (
        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <Stack sx={{ gap: 2 }}>
            {orderHistory?.map(({ id, title }: any) => {
              return (
                <ProductsCard key={id} sx={{ alignItems: 'center' }}>
                  <Image
                    height={40}
                    width={40}
                    src={IMAGES.HandEmoji}
                    alt='HandEmoji'
                    style={{
                        width: 'auto',
                        height: '40px'
                    }}
                  />
                  <Typography variant='subtitle1'>
                    <Box component='span' sx={{ fontWeight: 400 }}>
                      {t('access_message')}
                      {':'}
                    </Box>{' '}
                    {title}
                  </Typography>
                </ProductsCard>
              );
            })}
            {isFreeTrial && (
              <ProductsCard>
                <Image
                  src={IMAGES.FireEmoji}
                  alt='FireEmoji'
                  width={40}
                  height={40}
                  style={{
                    width: 'auto',
                    height: '40px'
                  }}
                />
                <Typography variant='subtitle1' sx={{ fontWeight: 400 }}>
                  <Box component='span' sx={{ fontWeight: 500 }}>
                    {t('trial_access_message', { trial_days: trailDays })}
                  </Box>{' '}
                  {t('trial_message', { trial_days: trailDays })}
                </Typography>
              </ProductsCard>
            )}
          </Stack>

          <Grid2 container spacing={{ xs: 3 }}>
            <Grid2 size={{ xs: 12, sm: 12, md: 6 }}>
              <CredentialsCard>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                    width: 'calc(100% - 40px)',
                  }}
                >
                  <Stack sx={{ fontSize: 24, color: '#E5E5E5' }}>
                    <ICONS.UserShared />
                  </Stack>
                  <Typography variant='subtitle1' noWrap>
                    <Box
                      component='span'
                      sx={{ fontWeight: 400, color: '#808080' }}
                    >
                      {t('login_text')}
                    </Box>{' '}
                    {userData?.email}
                  </Typography>
                </Stack>
                <IconButton
                  color='primary'
                  sx={{ mr: -1, color: 'primary.main' }}
                  onClick={() => {
                    if (!emailIsCopied) {
                      copyEmail(userData?.email);
                    }
                  }}
                  disableRipple={emailIsCopied}
                  disabled={emailLoading}
                >
                  {emailIsCopied ? (
                    <ICONS.CheckFatBold />
                  ) : (
                    <ICONS.FileCopyLine />
                  )}
                </IconButton>
              </CredentialsCard>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 12, md: 6 }}>
              <CredentialsCard>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                    width: 'calc(100% - 40px)',
                  }}
                >
                  <Stack sx={{ fontSize: 24, color: '#E5E5E5' }}>
                    <ICONS.OutlineLockClosed />
                  </Stack>
                  <Typography variant='subtitle1' noWrap>
                    <Box
                      component='span'
                      sx={{ fontWeight: 400, color: '#808080' }}
                    >
                      {t('password_text')}
                    </Box>{' '}
                    {plainPassword}
                  </Typography>
                </Stack>
                <IconButton
                  color='primary'
                  sx={{ mr: -1, color: 'primary.main' }}
                  onClick={() => {
                    if (!passwordIsCopied) {
                      copyPassword(plainPassword);
                    }
                  }}
                  disableRipple={passwordIsCopied}
                  disabled={passwordLoading}
                >
                  {passwordIsCopied ? (
                    <ICONS.CheckFatBold />
                  ) : (
                    <ICONS.FileCopyLine />
                  )}
                </IconButton>
              </CredentialsCard>
            </Grid2>
          </Grid2>
        </>
      )}
      <Typography variant='body2'>
        {t.rich('email_support_message_new', {
          email: SUPPORT_MAIL,
          a: chunks => <Link href={`mailto:${SUPPORT_MAIL}`}>{chunks}</Link>,
        })}
      </Typography>
      <Typography variant='caption' sx={{ color: '#808080' }}>
        {t('course_dashboard_message')}
      </Typography>
      <CustomButton
        size='large'
        variant='gradient'
        sx={{
          width: '100%',
          maxWidth: { sm: '320px' },
        }}
        onClick={() => {
          setActiveTab(2);
        }}
        disabled={!userData?.id}
      >
        {t('go_to_course')}
      </CustomButton>
    </>
  );
};

export default CredentialsForm;
