import React from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Stack,
  styled,
} from '@mui/material';
import { MANAGER_IMAGE } from '@/assets/images';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

const StyledLink = styled(Link)(() => ({
  color: 'inherit',
  textDecoration: 'none',
  transition: 'opacity 0.3s',
  '&:hover': {
    opacity: 0.7,
  },
}));

const CustomerReviews = ({ SUPPORT_MAIL }: any) => {
  const t = useTranslations();

  return (
    <Container maxWidth='md' sx={{ py: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          backgroundColor: '#F8F9FA',
          borderRadius: 1,
          p: 4,
        }}
      >
        <Stack
          direction={'row'}
          spacing={{ xs: 2, sm: 3 }}
          alignItems={'center'}
        >
          <Image
            width={94}
            height={94}
            loading='lazy'
            src={MANAGER_IMAGE}
            alt='Customer Happiness Manager'
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <Box>
            <Typography
              variant='h6'
              component='h2'
              gutterBottom
              fontSize={{ xs: 16, sm: 20 }}
            >
              {t('manager_intro')}
            </Typography>
            <Typography
              display={{ xs: 'none', md: 'block' }}
              color='text.secondary'
              fontSize={16}
            >
              {t.rich('customer_support_message', {
                email: SUPPORT_MAIL,
                a: chunks => (
                  <StyledLink href={`mailto:${SUPPORT_MAIL}`}>
                    {chunks}
                  </StyledLink>
                ),
              })}
            </Typography>
          </Box>
        </Stack>
        <Typography
          mt={1.25}
          display={{ xs: 'block', md: 'none' }}
          color='text.secondary'
          fontSize={16}
        >
          <>
            Our care and customer support team is ready to help at any time. If
            you have any questions, just email{' '}
            <StyledLink href={`mailto:${SUPPORT_MAIL}`}>
              {SUPPORT_MAIL}
            </StyledLink>
          </>
        </Typography>
      </Box>
    </Container>
  );
};

export default CustomerReviews;
