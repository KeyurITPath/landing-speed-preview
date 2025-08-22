import { useCallback, useState } from 'react';
import {
  accordionSummaryClasses,
  Stack,
  styled,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  Typography,
  AccordionDetails as MuiAccordionDetails,
  Grid2,
} from '@mui/material';
import { ICONS } from '@assets/icons';
import { useMessages, useTranslations } from 'next-intl';
import Link from 'next/link';

const StyledLink = styled(Link)(() => ({
  color: '#782fef',
  textDecoration: 'none',
  transition: 'opacity 0.3s',
  '&:hover': {
    opacity: 0.7,
  },
}));

const Accordion = styled(props => (
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
        <Stack
          sx={{
            borderRadius: '4px',
            minWidth: 0,
            p: 0.4,
            fontSize: 15,
            color: 'common.white',
            backgroundColor: expanded ? theme => theme.palette.primaryNew.main : theme => theme.palette.secondary.main,
            transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
            ...(expanded && {
              transform: 'rotate(180deg)',
            }),
          }}
        >
          <ICONS.AngleDown />
        </Stack>
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

const CourseDetailsForFAQ = ({ BRAND_NAME, SUPPORT_MAIL }: any) => {
  const t = useTranslations();
  const messages = useMessages();

  const [expanded, setExpanded] = useState({
    general_faq: [],
    pricing_faq: [],
  });

  const GENERAL_FAQ_TITLE = t('generalFaqTitle');
  const PRICING_FAQ_TITLE = t('pricingFaqTitle');

  const GENERAL_FAQS = messages['general_faqs'];
  const PRICING_FAQS = messages['pricing_faqs'];

  const handleChange = useCallback((category: any, id: any) => {
    setExpanded(prev => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter((i: any) => i !== id)
        : [id],
    }));
  }, []);

  return (
    <Grid2 size={{ xs: 12 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <Typography
            sx={{
              fontSize: { xs: 26, sm: 28 },
              fontWeight: 500,
            }}
            color='primary.typography'
          >
            {t('faqTitle')}
          </Typography>
        </Grid2>

        {/* General FAQs */}
        <Grid2 size={{ xs: 12 }}>
          <Typography
            fontSize={{ xs: 16, sm: 16 }}
            fontWeight={500}
            sx={{ color: '#304BE0' }}
          >
            {GENERAL_FAQ_TITLE}
          </Typography>
          <Grid2 container spacing={2}>
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
                      <Typography variant='subtitle1' sx={{ color: 'inherit' }}>
                        {t.rich(`general_faqs.${index}.question`, {
                          brand_name: BRAND_NAME,
                          email: SUPPORT_MAIL,
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
                                email: SUPPORT_MAIL,
                                brand_name: BRAND_NAME,
                                a: chunk => (
                                  <StyledLink href={`mailto:${SUPPORT_MAIL}`}>
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
          </Grid2>
        </Grid2>

        {/* Pricing FAQs */}
        <Grid2 size={{ xs: 12 }}>
          <Typography
            fontSize={{ xs: 16, sm: 16 }}
            fontWeight={500}
            sx={{ color: '#304BE0' }}
          >
            {PRICING_FAQ_TITLE}
          </Typography>
          <Grid2 container spacing={2}>
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
                      <Typography variant='subtitle1' sx={{ color: 'inherit' }}>
                        {t.rich(`pricing_faqs.${index}.question`, {
                          brand_name: BRAND_NAME,
                          email: SUPPORT_MAIL,
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
                                email: SUPPORT_MAIL,
                                brand_name: BRAND_NAME,
                                a: chunk => (
                                  <StyledLink href={`mailto:${SUPPORT_MAIL}`}>
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
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default CourseDetailsForFAQ;
