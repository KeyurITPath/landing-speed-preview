import React from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Stack,
  styled,
} from '@mui/material';
import { ICONS } from '@/assets/icons';
import { success } from '@/theme/color';
import { SERVER_URL } from '@/utils/constants';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { videoURL } from '../../../../../utils/helper';

const StyledLink = styled(Link)(() => ({
  color: '#782fef',
  textDecoration: 'none',
  fontWeight: 400,
  transition: 'opacity 0.3s',
  '&:hover': {
    opacity: 0.7,
  },
}));

const CourseAuthor = ({ data, SUPPORT_MAIL }: any) => {
  const t = useTranslations();
  return (
    <Container maxWidth='md' sx={{ py: { xs: 2, md: 4 } }}>
      <Typography
        color='primary.typography'
        fontWeight={500}
        fontSize={28}
        mt={{ xs: 2, sm: 3 }}
        mb={4}
      >
        {t('meet_course_author')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          alignItems: { xs: 'flex-start' },
          flexDirection: {xs: 'column', sm: 'row'},
          mt: { xs: 2, sm: 4 },
        }}
      >
        <Box
          sx={{
            width: {xs: 50, sm: 100},
            height: {xs: 50, sm: 100},
            borderRadius: '50%',
            minWidth: {xs: 50, sm: 100},
            overflow: 'hidden',
            position: 'relative', // required for fill
          }}
        >
          <Image
            alt='course_author'
            src={videoURL(data?.author_image)}
            fill
            sizes='100vw'
            style={{ objectFit: 'cover' }}
            loading='lazy'
          />
        </Box>
        <Stack spacing={2}>
          <Typography
            fontWeight={400}
            fontSize={16}
            color='primary.typography'
            dangerouslySetInnerHTML={{
              __html: data?.author_bio || '',
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
            }}
          />
        </Stack>
      </Box>
      <Box
        my={{ xs: 2, sm: 6 }}
        sx={{
          backgroundColor: success.light,
          p: { xs: 2 },
          borderRadius: { xs: 0, sm: 1 },
          mx: { xs: '-16px', sm: 2 },
        }}
      >
        <Stack
          direction={'row'}
          spacing={{ xs: 1, sm: 2 }}
          alignItems={'flex-start'}
        >
          <Box>
            <ICONS.INFO_OUTLINED size={20} style={{ color: '#00cf91' }} />
          </Box>

          <Stack spacing={0.5}>
            <Typography fontWeight={600} fontSize={16}>
              {t.rich('refund_after_days', {
                email: SUPPORT_MAIL,
                span: chunks => (
                  <span style={{ fontWeight: 400 }}>{chunks}</span>
                ),
                a: chunks => (
                  <StyledLink href={`mailto:${SUPPORT_MAIL}`}>
                    {chunks}
                  </StyledLink>
                ),
              })}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};

export default CourseAuthor;
