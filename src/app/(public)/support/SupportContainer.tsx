'use client';
import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslations, useMessages } from 'next-intl';
import { ICONS } from '@/assets/icons';
import { routes } from '@/utils/constants/routes';
import CustomButton from '@/shared/button';

const StyledAccordion = styled(Accordion)(() => ({
  ':hover': {
    '& .MuiAccordionSummary-expandIconWrapper': {
      backgroundColor: '#333333',
      borderRadius: '50%',
      '& svg': {
        color: '#a0a0a0',
      },
    },
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  '& .MuiAccordionSummary-expandIconWrapper': {
    padding: theme.spacing(0.8),
    '&:hover': {
      backgroundColor: '#333333',
      borderRadius: '50%',
    },
    '& svg': {
      color: '#a0a0a0',
    },
    '&.Mui-expanded': {
      backgroundColor: '#333333',
      borderRadius: '50%',
      '& svg': {
        color: '#a0a0a0',
      },
    },
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1, 0),
}));

const StyledLink = styled(Link)(() => ({
  color: '#782fef',
  textDecoration: 'none',
  transition: 'opacity 0.3s',
  '&:hover': {
    opacity: 0.7,
  },
}));

const SupportContainer = ({ domainDetails }: any) => {
  const t = useTranslations();
  const messages = useMessages();
  const [expanded, setExpanded] = useState(false);
  const handleChange = useCallback(
    (panel: any) => (event: any, isExpanded: any) => {
      setExpanded(isExpanded ? panel : false);
    },
    []
  );

  const { email, brand_name } = domainDetails?.domain_detail || {};

  const SUPPORT_FAQS = messages['supportFaqs'];

  return (
    <Container
      maxWidth='lg'
      sx={{
        bgcolor: 'common.white',
        pt: { xs: 2, sm: 5 },
        pb: { xs: 4, sm: 7 },
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Stack sx={{ maxWidth: '1000px', width: '100%' }}>
        <Stack sx={{ gap: { xs: 1, sm: 2 }, mb: { xs: 1, sm: 2 } }}>
          <Breadcrumbs aria-label='breadcrumb'>
            <Link
              color='#808080'
              href='/'
              style={{ textDecoration: 'none', fontSize: '13px' }}
            >
              {brand_name || ''}
            </Link>
            <Typography sx={{ color: 'text.primary', fontSize: 13 }}>
              {t('mainTermsSupport.breadCrumb')}
            </Typography>
          </Breadcrumbs>
          <Stack
            sx={{
              textAlign: 'center',
              justifyContent: 'center',
            }}
            spacing={3}
          >
            <Typography
              sx={{
                fontSize: { xs: '1.375rem', sm: '2.375rem' },
                fontWeight: 600,
              }}
            >
              {t.rich('mainTermsSupport.title', {
                email: email, // email
                brand_name: brand_name, // BRAND_NAME
                a: chunks => (
                  <StyledLink href={`mailto:${email}`}>{chunks}</StyledLink>
                ),
                br: () => <br />,
              })}
            </Typography>
            <Typography variant='body1'>
              {t.rich('mainTermsSupport.description', {
                email: email, // email
                brand_name: brand_name, // BRAND_NAME
                a: chunks => (
                  <StyledLink href={`mailto:${email}`}>{chunks}</StyledLink>
                ),
                br: () => <br />,
              })}
            </Typography>
          </Stack>
          <Stack gap={2} sx={{ textAlign: 'left', marginTop: '1rem' }}>
            <Typography
              sx={{
                fontSize: { xs: '1.7rem', sm: '2rem' },
                textAlign: 'left',
                fontWeight: 600,
              }}
            >
              {t('faqTitleSupport')}
            </Typography>
          </Stack>
        </Stack>
        {/* Accordion Sections */}
        {Array.isArray(SUPPORT_FAQS) &&
          SUPPORT_FAQS?.map((item, index) => (
            <StyledAccordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                mb: { xs: 0.5, md: 1 },
                '&:before': { display: 'none' },
                boxShadow: 'none',
                borderRadius: '0 !important',
              }}
            >
              <StyledAccordionSummary
                expandIcon={
                  expanded === `panel${index}` ? (
                    <ICONS.CLOSE size={24} color='primary.secondary' />
                  ) : (
                    <ICONS.ADD
                      size={24}
                      color='primary.secondary'
                      style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: 'center',
                        transition: 'all .25s ease-in-out',
                      }}
                    />
                  )
                }
                sx={{
                  borderBottom: '1px solid #e0e0e0',
                  borderTop: index === 0 ? '1px solid #e0e0e0' : 'none',
                  '&.Mui-expanded': { borderBottom: 'none' },
                  '& .MuiAccordionSummary-content': {
                    margin: { xs: '12px 0', md: '16px 0' },
                  },
                }}
              >
                <Typography fontWeight={500} fontSize={16} pr={2}>
                  {t.rich(`supportFaqs.${index}.title`, {
                    brand_name: brand_name,
                    email: email,
                    a: chunks => (
                      <StyledLink href={`mailto:${email}`}>{chunks}</StyledLink>
                    ),
                    br: () => <br />,
                    strong: chunks => <strong>{chunks}</strong>,
                  })}
                </Typography>
              </StyledAccordionSummary>

              <StyledAccordionDetails>
                <Box fontSize={16} fontWeight={400} color='primary.typography'>
                  {t.rich(`supportFaqs.${index}.description`, {
                    brand_name: brand_name,
                    email: email,
                    a: chunks => (
                      <StyledLink href={`mailto:${email}`}>{chunks}</StyledLink>
                    ),
                    br: () => <br></br>,
                    ol: chunks => (
                      <ol style={{ WebkitPaddingStart: '1.5em' }}>{chunks}</ol>
                    ),
                    li: chunks => <li>{chunks}</li>,
                    strong: chunks => <strong>{chunks}</strong>,
                    termsLink: chunks => (
                      <Link
                        component='span'
                        onClick={() =>
                          window.open(routes.public.terms_of_service, '_blank')
                        }
                        sx={{ cursor: 'pointer', color: '#782fef' }}
                        underline='hover'
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </Box>
              </StyledAccordionDetails>
            </StyledAccordion>
          ))}
        <Stack sx={{ py: { xs: 2, sm: 7 } }} spacing={2}>
          <Typography
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              textAlign: 'left',
              fontWeight: 600,
            }}
          >
            {t('supportFooter.title')}
          </Typography>
          <Typography variant='body1'>
            {t.rich('supportFooter.description', {
              email,
              brand_name,
              a: chunks => (
                <StyledLink href={`mailto:${email}`}>{chunks}</StyledLink>
              ),
            })}
          </Typography>
        </Stack>
        <Stack
          sx={{
            pt: { xs: 1, sm: 2 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
          gap={1}
        >
          <CustomButton
            sx={{
              ml: { xs: 0, sm: 2 },
              height: 60,
              width: 270,
              color: '#000000',
              borderRadius: '10px',
              border: '3px solid #000000',
              fontWeight: 700,
              '&.MuiButton-outlined': {
                color: '#000000',
                borderColor: '#000000',
              },
              '&:hover': {
                color: '#000000',
                borderColor: '#000000',
                opacity: 0.8,
              },
            }}
            variant='outlined'
            onClick={() => (window.location.href = `mailto:${email}`)}
          >
            {email}
          </CustomButton>
        </Stack>
      </Stack>
    </Container>
  );
};

export default SupportContainer;
