import { useState } from 'react';
import {
  accordionSummaryClasses,
  Stack,
  styled,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  Typography,
  AccordionDetails as MuiAccordionDetails,
} from '@mui/material';
import CustomButton from '@/shared/button';
import { ICONS } from '@/assets/icons';
import { useTranslations, useMessages } from 'next-intl';

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
            backgroundColor: expanded ? 'primaryNew.main' : 'secondary.main',
            borderRadius: '4px',
            p: 0.4,
            color: 'common.white',
            transition: 'transform 0.2s ease-in-out',
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

const Faqs = ({ BRAND_NAME }: any) => {
  const [expanded, setExpanded] = useState(false);

  const t = useTranslations();
  const messages = useMessages();

  const faqData = messages['trials_activation_faq'];

  const handleChange = (panel: any) => (_, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Stack sx={{ gap: { xs: 2.5, sm: 3 } }}>
      <Typography variant='h5' sx={{ zIndex: 1, fontWeight: 500 }}>
        {t('faqTitleShort')}
      </Typography>
      <Stack sx={{ gap: { xs: 2, sm: 2 } }}>
        {faqData?.map(({ id, question, answers }: any) => {
          const isExpanded = expanded === id;
          return (
            <Accordion
              key={id}
              expanded={isExpanded}
              onChange={handleChange(id)}
            >
              <AccordionSummary
                expanded={isExpanded}
                aria-controls='panel1d-content'
                id={`panel-${id}-header`}
              >
                <Typography variant='subtitle1' sx={{ color: 'inherit' }}>
                  {t(`trials_activation_faq.${id - 1}.question`, {
                    brand_name: BRAND_NAME,
                  })}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {answers.map((_: any, index: number) => (
                  <Typography key={index} variant='body2'>
                    {t(`trials_activation_faq.${id - 1}.answers.${index}`, {
                      brand_name: BRAND_NAME,
                    })}
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default Faqs;
