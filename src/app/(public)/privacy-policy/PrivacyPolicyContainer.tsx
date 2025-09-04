'use client';
import React, { useCallback, useState } from 'react';
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
import { useTranslations, useMessages } from 'next-intl';
import { ICONS } from '@/assets/icons';
import { routes } from '@/utils/constants/routes';

const StyledAccordion = styled(Accordion)(() => ({
  ':hover': {
    '& .MuiAccordionSummary-expandIconWrapper': {
      backgroundColor: '#333333',
      borderRadius: '50%',
      '& svg': { color: '#a0a0a0' },
    },
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  '& .MuiAccordionSummary-expandIconWrapper': {
    padding: theme.spacing(0.8),
    '&:hover': { backgroundColor: '#333333', borderRadius: '50%' },
    '& svg': { color: '#a0a0a0' },
    '&.Mui-expanded': {
      backgroundColor: '#333333',
      borderRadius: '50%',
      '& svg': { color: '#a0a0a0' },
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
  '&:hover': { opacity: 0.7 },
}));

const PrivacyPolicyContainer = ({ domainDetails }: any) => {
  const t = useTranslations();
  const messages = useMessages();
  const [expanded, setExpanded] = useState(false);

  const handleChange = useCallback(
    (panel: any) => (_event: any, isExpanded: any) =>
      setExpanded(isExpanded ? panel : false),
    []
  );

  const { email, brand_name } = domainDetails?.domain_detail || {};
  const PRIVACY_POLICIES = messages['privacyPolicies'];

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
        {/* Breadcrumb & Title */}
        <Stack sx={{ gap: { xs: 1, sm: 2 }, mb: { xs: 1, sm: 2 } }}>
          <Breadcrumbs aria-label='breadcrumb'>
            <Link
              color='#808080'
              href='/'
              sx={{ textDecoration: 'none', fontSize: 13 }}
            >
              {brand_name}
            </Link>
            <Typography sx={{ color: 'text.primary', fontSize: 13 }}>
              {t('privacyPolicy')}
            </Typography>
          </Breadcrumbs>

          <Typography fontSize={'1.75rem'} fontWeight={500}>
            {t('privacyPolicy')}
          </Typography>
          <Typography variant='body1'>{t('effective_date')}</Typography>
        </Stack>

        {/* Accordion Sections */}
        {PRIVACY_POLICIES?.map((item: any, index: number) => (
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
                {t.rich(`privacyPolicies.${index}.title`, {
                  brand_name: brand_name,
                  email: email,
                  a: chunks => (
                    <StyledLink href={`mailto:${email}`}>{chunks}</StyledLink>
                  ),
                  double: () => (
                    <>
                      <br />
                      <br />
                    </>
                  ),
                  single: () => (
                    <>
                      <br />
                    </>
                  ),
                  b: (chunk) => <strong>{chunk}</strong>,
                  ol: chunks => (
                    <ol style={{ WebkitPaddingStart: '1.5em' }}>{chunks}</ol>
                  ),
                  li: chunks => <li>{chunks}</li>,
                  ul: chunks => (
                    <ul style={{ paddingLeft: '1.5em' }}>{chunks}</ul>
                  ),
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
              </Typography>
            </StyledAccordionSummary>

            <StyledAccordionDetails>
              <Box fontSize={16} fontWeight={400} color='primary.typography'>
                {t.rich(`privacyPolicies.${index}.description`, {
                  brand_name: brand_name,
                  email: email,
                  a: chunks => (
                    <StyledLink href={`mailto:${email}`}>{chunks}</StyledLink>
                  ),
                  span: chunks => <span>{chunks}</span>,
                  stripe: chunks => <StyledLink href='https://stripe.com/privacy' target='_blank' >{chunks}</StyledLink>,
                  network: chunks => <StyledLink href='https://www.networkadvertising.org/optout_nonppii.asp' target='_blank' >{chunks}</StyledLink>,
                  double: () => (
                    <>
                      <br />
                      <br />
                    </>
                  ),
                  single: () => (
                    <>
                      <br />
                    </>
                  ),
                  b: (chunk) => <strong>{chunk}</strong>,
                  p: chunks => <Typography variant='body1'>{chunks}</Typography>,
                  strong: chunks => <strong>{chunks}</strong>,
                  strong_brand: chunks => <strong>{chunks}</strong>,
                  strong_policy: chunks => <strong>{chunks}</strong>,
                  ol: chunks => (
                    <ol style={{ paddingLeft: '1.5em' }}>{chunks}</ol>
                  ),
                  ul: chunks => (
                    <ul style={{ paddingLeft: '1.5em' }}>{chunks}</ul>
                  ),
                  li: chunks => <li>{chunks}</li>,
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
      </Stack>
    </Container>
  );
};

export default PrivacyPolicyContainer;
