import {
  accordionSummaryClasses,
  Stack,
  styled,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  Typography,
  AccordionDetails as MuiAccordionDetails,
  Container,
  Box,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { ICONS } from '@/assets/icons';
import { useTranslations, useMessages } from 'next-intl';
import Link from 'next/link';

const StyledLink = styled(Link)(() => ({
  color: '#782fef',
  textDecoration: 'none',
  transition: 'opacity 0.3s',
  '&:hover': {
    opacity: 0.7,
  },
}));

const Accordion = styled((props: any) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  [`&.${accordionSummaryClasses.expanded}`]: {
    outlineStyle: 'solid',
    outlineWidth: 1,
    outlineColor: theme.palette.primaryNew.main,
  },
  borderRadius: 12,
  '&::before': {
    display: 'none',
  },
  backgroundColor: '#f5f6fd',
}));

const AccordionSummary = styled(({ expanded, ...props }: any) => {
  return (
    <MuiAccordionSummary
      expandIcon={
        <Box
          sx={{
            borderRadius: '4px',
            minWidth: 0,
            p: 0.4,
            fontSize: 15,
            color: 'common.white',
            backgroundColor: expanded ? 'primaryNew.main' : 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
            ...(expanded && {
              transform: 'rotate(180deg)',
            }),
          }}
        >
          <ICONS.AngleDown />
        </Box>
      }
      {...props}
    />
  );
})(({ theme }) => ({
  minHeight: 55,
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(0deg)',
    },
  [`&.${accordionSummaryClasses.expanded}`]: {
    color: theme.palette.primaryNew.main,
  },
  gap: theme.spacing(1),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const Faqs = ({ domainDetails }: any) => {
  const DOMAIN_DETAILS = {
    BRAND_NAME: domainDetails?.data?.domain_detail?.brand_name || '',
    SUPPORT_MAIL: domainDetails?.data?.domain_detail?.email || '',
  };
  const t = useTranslations();

  const messages = useMessages();

  const [expanded, setExpanded] = useState<{
    general_faq: string[];
    pricing_faq: string[];
  }>({
    general_faq: [],
    pricing_faq: [],
  });

  const handleChange = useCallback((key: any, id: any) => {
    setExpanded((prev: any) => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter((item: any) => item !== id)
        : [id],
    }));
  }, []);

  const GENERAL_FAQS = messages['general_faqs'];
  const PRICING_FAQS = messages['pricing_faqs'];

  return (
    <Container maxWidth='lg'>
      <Stack spacing={4} id='faq'>
        <Typography
          variant='h4'
          sx={{
            zIndex: 1,
            fontWeight: 500,
            textAlign: { xs: 'left', sm: 'center' },
          }}
        >
          {t('faqTitle')}
        </Typography>
        <Stack sx={{ gap: { xs: 2, sm: 6 } }}>
          <Stack sx={{ gap: 2.5 }}>
            <Typography
              variant='subtitle1'
              sx={{ zIndex: 1, textAlign: 'left', color: 'primaryNew.main' }}
            >
              {t('generalFaqTitle')}
            </Typography>

            <Stack sx={{ mx: { xs: 1, sm: 0 } }} spacing={1.2}>
              {GENERAL_FAQS?.map(
                ({ id, question, answers }: any, index: number) => {
                  const isExpanded = expanded.general_faq.includes(id);

                  return (
                    <Accordion
                      key={id}
                      expanded={isExpanded}
                      onChange={() => handleChange('general_faq', id)}
                    >
                      <AccordionSummary
                        expanded={isExpanded}
                        aria-controls='panel1d-content'
                        id='panel-header'
                      >
                        <Typography
                          variant='subtitle1'
                          sx={{ color: 'inherit' }}
                        >
                          {t.rich(`general_faqs.${index}.question`, {
                            brand_name: DOMAIN_DETAILS.BRAND_NAME,
                            email: DOMAIN_DETAILS.SUPPORT_MAIL,
                          })}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {answers.map((answer: any, answerIndex: number) => (
                          <Typography key={answerIndex} variant='body2'>
                            <>
                              {t.rich(
                                `general_faqs.${index}.answers.${answerIndex}`,
                                {
                                  email: DOMAIN_DETAILS.SUPPORT_MAIL,
                                  brand_name: DOMAIN_DETAILS.BRAND_NAME,
                                  a: chunk => (
                                    <StyledLink
                                      href={`mailto:${DOMAIN_DETAILS.SUPPORT_MAIL}`}
                                    >
                                      {chunk}
                                    </StyledLink>
                                  ),
                                }
                              )}
                            </>
                          </Typography>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              )}
            </Stack>
          </Stack>
          <Stack sx={{ gap: 2.5 }}>
            <Typography
              variant='subtitle1'
              sx={{ zIndex: 1, textAlign: 'left', color: 'primaryNew.main' }}
            >
              {t('pricingFaqTitle')}
            </Typography>

            <Stack sx={{ mx: { xs: 1, sm: 0 } }} spacing={1.2}>
              {PRICING_FAQS?.map(
                ({ id, question, answers }: any, index: number) => {
                  const isExpanded = expanded.pricing_faq.includes(id);

                  return (
                    <Accordion
                      key={id}
                      expanded={isExpanded}
                      onChange={() => handleChange('pricing_faq', id)}
                    >
                      <AccordionSummary
                        expanded={isExpanded}
                        aria-controls='panel1d-content'
                        id='panel-header'
                      >
                        <Typography
                          variant='subtitle1'
                          sx={{ color: 'inherit' }}
                        >
                          {t.rich(`pricing_faqs.${index}.question`, {
                            brand_name: DOMAIN_DETAILS.BRAND_NAME,
                            email: DOMAIN_DETAILS.SUPPORT_MAIL,
                          })}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {answers.map((answer: any, answerIndex: number) => (
                          <Typography key={answerIndex} variant='body2'>
                            <>
                              {t.rich(
                                `pricing_faqs.${index}.answers.${answerIndex}`,
                                {
                                  email: DOMAIN_DETAILS.SUPPORT_MAIL,
                                  brand_name: DOMAIN_DETAILS.BRAND_NAME,
                                  a: chunk => (
                                    <StyledLink
                                      href={`mailto:${DOMAIN_DETAILS.SUPPORT_MAIL}`}
                                    >
                                      {chunk}
                                    </StyledLink>
                                  ),
                                }
                              )}
                            </>
                          </Typography>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Faqs;
