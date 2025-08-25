import { Stack, Typography } from '@mui/material';
import { ICONS } from '@/assets/icons';
import { linearGradients } from '@/theme/color';
import { useTranslations } from 'next-intl';

const OneTimeOpportunity = ({ BRAND_NAME }: any) => {
  const t = useTranslations();
  const points = [
    {
      id: 1,
      icon: <ICONS.Meditation />,
      description: t.rich('points.1', {
        b: chunks => <strong>{chunks}</strong>,
      }),
    },
    {
      id: 2,
      icon: <ICONS.OutlineGroups />,
      description: t.rich('points.2', {
        b: chunks => <strong>{chunks}</strong>,
      }),
    },
    {
      id: 3,
      icon: <ICONS.LockOpen />,
      description: t.rich('points.3', {
        b: chunks => <strong>{chunks}</strong>,
      }),
    },
  ];

  return (
    <Stack sx={{ gap: { xs: 3, sm: 4 } }}>
      <Stack sx={{ flexDirection: 'row', gap: 1.5 }}>
        <Stack
          sx={{
            color: 'common.black',
            fontSize: 28,
            mt: { xs: -0.5, sm: -0.5, md: -0.3 },
          }}
        >
          <ICONS.OutlineGift />
        </Stack>
        <Typography variant='h5'>{t('exclusiveOpportunity')}</Typography>
      </Stack>
      <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
        {points.map(({ id, icon, description }) => (
          <Stack
            key={id}
            sx={{ flexDirection: 'row', gap: { xs: 1.5, sm: 2.5 } }}
          >
            <Stack
              sx={{
                height: '35px',
                minWidth: '35px',
                borderRadius: 0.8,
                alignItems: 'center',
                justifyContent: 'center',
                background: linearGradients.primary,
                color: 'common.white',
                fontSize: 20,
                mt: -1,
              }}
            >
              {icon}
            </Stack>
            <Typography variant='body1'>{description}</Typography>
          </Stack>
        ))}
      </Stack>
      <Typography variant='h5' sx={{ color: 'primaryNew.main' }}>
        {t('transformationMessage', { brand_name: BRAND_NAME })}
      </Typography>
    </Stack>
  );
};

export default OneTimeOpportunity;
