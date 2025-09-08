import {
  Avatar,
  Box,
  IconButton,
  Rating,
  Stack,
  Typography,
  Dialog,
  DialogContent,
} from '@mui/material';
import CustomButton from '@/shared/button';
import { ICONS } from '@/assets/icons';
import { primaryNew } from '@/theme/color';
import { IMAGES } from '@/assets/images';
import useTrialPopup from './useTrialPopup';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '../../utils/helper';

const TrialPopup = ({ dashboardData }: any) => {
  const { trialPopupClose, trialPopupState } = dashboardData || {};

  const {
    loading,
    details,
    timeline,
    transformData,
    startFreeTrialSubmit,
    discountPlan,
    is_user_purchased_trial,
    handleSubmitSubscriptionPlan,
  } = useTrialPopup({
    trialPopupClose,
    trialPopupState,
  });

  const { title, description, trial_days }: any = transformData || {};
  const t = useTranslations();

  return (
    <Dialog
      open={Boolean(trialPopupState?.['open'])}
      onClose={trialPopupClose}
      fullWidth={true}
      maxWidth='md'
      PaperProps={{
        sx: {
          m: { xs: '20px', sm: 0 },
          width: '100%',
          borderRadius: { xs: 1, md: 2 },
          overflow: 'hidden',
          maxWidth: { xs: '100% !important', sm: '1024px !important' },
        },
      }}
      sx={{ backgroundColor: ' #00000066' }}
    >
      <IconButton
        aria-label='Close'
        onClick={trialPopupClose}
        size='small'
        sx={{
          position: 'absolute',
          top: 5,
          right: 10,
          color: { xs: 'black', md: 'white' },
          fontSize: { xs: 22, sm: 28 },
          zIndex: 9,
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.6)',
          },
        }}
      >
        <ICONS.CLOSE />
      </IconButton>
      <DialogContent
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          height: '100%',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            borderRadius: { xs: 2, md: 0 },
            zIndex: 2,
            background: 'white',
          }}
        >
          <Stack
            sx={{
              flex: 1,
              px: { xs: 2, md: 5 },
              py: { xs: 5, md: 5 },
              display: 'flex',
              maxWidth: { xs: '100%', md: '500px' },
              borderRadius: { xs: 2, md: 0 },
            }}
            spacing={3.5}
          >
            <Stack spacing={2}>
              <Typography
                sx={{
                  fontSize: { xs: '20px', md: '32px' },
                  fontWeight: 700,
                  textAlign: 'left',
                }}
              >
                {title}
              </Typography>

              <Typography
                fontWeight={600}
                color='primary.typography'
                dangerouslySetInnerHTML={{
                  __html: description || '',
                }}
                sx={{
                  '& ul': {
                    listStyleType: 'disc',
                    marginLeft: 2,
                    paddingLeft: 2,
                  },
                  '& li': {
                    display: 'list-item',
                  },
                  whiteSpace: 'break-spaces',
                  fontSize: { xs: '16px', md: '18px' },
                }}
              />
            </Stack>

            <Stack spacing={2} mt={1}>
              {details?.map(item => (
                <Box
                  gap={2}
                  key={item.id}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <item.icon
                    style={{
                      color: '#304BE0',
                      width: 22,
                      height: 22,
                      overflow: 'visible',
                    }}
                  />
                  <Typography fontSize={14} fontWeight={700}>
                    {item.label}
                    {item.description && (
                      <span style={{ fontWeight: 400 }}>
                        {item.description}
                      </span>
                    )}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <CustomButton
              variant='gradient'
              {...{ loading }}
              sx={{
                textTransform: 'uppercase',
                fontSize: 18,
                fontWeight: 500,
                minHeight: '58px',
                width: { xs: '100%', md: '300px' },
                borderRadius: '8px',
                mx: { xs: 'auto', md: 0 },
              }}
              onClick={() => {
                if (is_user_purchased_trial) {
                  if (typeof handleSubmitSubscriptionPlan === 'function') {
                    handleSubmitSubscriptionPlan({});
                  }
                } else if (typeof startFreeTrialSubmit === 'function') {
                  startFreeTrialSubmit({});
                }
              }}
            >
              {is_user_purchased_trial
                ? `${t('start_monthly_plan')}: ${formatCurrency(discountPlan?.subscription_plan_prices?.[0]?.amount || 0, discountPlan?.subscription_plan_prices?.[0]?.currency?.name)}`
                : `${t('trial_popup.start_free_trial', { trial_days: trial_days })}`}
            </CustomButton>
          </Stack>
        </Box>
        <Stack
          sx={{
            flex: 1,
            px: { xs: 2, md: 5 },
            py: { xs: 4, md: 7 },
            display: 'flex',
            flexDirection: 'column',
            backgroundImage: `url(${IMAGES.userPopupBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            top: 0,
            zIndex: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(14, 14, 14, 0.87)',
            },
          }}
          spacing={3.5}
        >
          <Stack
            spacing={{ xs: 1, md: 5 }}
            sx={{ position: 'relative', zIndex: 2 }}
            gap={{ xs: 3.5, md: 0 }}
          >
            <Stack
              sx={{
                border: '1px solid #304BE0',
                borderRadius: '20px',
                bgcolor: '#F5F7FF',
                p: '20px',
                textAlign: 'left',
                order: { xs: 3, md: 2 },
              }}
              spacing={3}
            >
              {' '}
              <Rating
                readOnly
                precision={0.5}
                value={5}
                sx={{ color: 'primaryNew.main' }}
                icon={
                  <Stack sx={{ fontSize: 'inherit' }}>
                    <ICONS.Star />
                  </Stack>
                }
                emptyIcon={
                  <Stack
                    sx={{
                      fontSize: 'inherit',
                      color: '#BBBBBB',
                    }}
                  >
                    <ICONS.StarOutline />
                  </Stack>
                }
              />
              <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>
                {t('trial_popup.user_review')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  justifyContent: 'flex-start',
                }}
              >
                <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                  Lauren M.
                </Typography>
              </Box>
            </Stack>
            {!is_user_purchased_trial && (
              <Stack
                spacing={2}
                sx={{ position: 'relative', order: { xs: 2, md: 3 } }}
              >
                {timeline?.map((item, index) => (
                  <Stack
                    direction='row'
                    spacing={2}
                    alignItems='flex-start'
                    key={index}
                    sx={{ position: 'relative' }}
                  >
                    <Stack
                      alignItems='center'
                      spacing={0}
                      sx={{ position: 'relative' }}
                    >
                      <Box
                        sx={{
                          width: 35,
                          height: 35,
                          background: primaryNew.main,
                          color: 'common.white',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                        }}
                      >
                        <item.icon
                          style={{
                            width: 20,
                            height: 20,
                          }}
                        />
                      </Box>
                      {index !== timeline.length - 1 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 2,
                            height: { xs: 50, md: 40 },
                            borderLeft: '1px dashed #FFFFFF',
                          }}
                        />
                      )}
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '14px', sm: '16px' },
                          color: 'common.white',
                          textAlign: 'left',
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'common.white',
                          fontSize: '14px',
                          fontWeight: 400,
                          textAlign: 'left',
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default TrialPopup;
