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

const TermsOfServiceContainer = ({ domainDetails }: any) => {
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

  const TERMS_OF_SERVICES = messages['terms_of_services'];

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
              sx={{ textDecoration: 'none', fontSize: 13 }}
            >
              {brand_name}
            </Link>
            <Typography sx={{ color: 'text.primary', fontSize: 13 }}>
              {t('mainTerms.title')}
            </Typography>
          </Breadcrumbs>

          {/* Main Title & Description */}
          <Typography fontSize={'1.75rem'} fontWeight={500}>
            {t('mainTerms.title')}
          </Typography>
          <Typography variant='body1'>
            {t.rich('mainTerms.description', {
              brand_name: brand_name, // replaces {brand_name}
              br: () => (
                <>
                  <br />
                </>
              ),
              p: chunks => <Typography variant='body1'>{chunks}</Typography>,
              span: chunks => <span>{chunks}</span>,
              strong: chunks => <strong>{chunks}</strong>,
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
                  )
            })}
          </Typography>
        </Stack>
        {/* Accordion Sections */}
        {TERMS_OF_SERVICES?.map((item: any, index: number) => (
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
                {t.rich(`terms_of_services.${index}.title`, {
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
                {t.rich(`terms_of_services.${index}.description`, {
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
                  b: () => <strong></strong>,
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
              </Box>
            </StyledAccordionDetails>
          </StyledAccordion>
        ))}
      </Stack>
    </Container>
  );
};

export default TermsOfServiceContainer;
