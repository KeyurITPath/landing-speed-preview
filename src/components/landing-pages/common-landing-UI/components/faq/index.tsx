import React from 'react';
import { useCallback, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  styled,
  Typography,
} from '@mui/material';
import { ICONS } from '@/assets/icons';
import { useTranslations, useMessages } from 'next-intl';
import Link from 'next/link';

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

const FAQ = ({ SUPPORT_MAIL }: any) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = useCallback(
    (panel: any) => (event: any, isExpanded: any) => {
      setExpanded(isExpanded ? panel : false);
    },
    []
  );

  const t = useTranslations();
  const messages = useMessages();

  const faqData = messages['faq'];

  return (
    <Container maxWidth='md' sx={{ py: { xs: 2, md: 4 } }}>
      <Typography
        color='primary.typography'
        fontWeight={500}
        fontSize={28}
        sx={{ marginBottom: '30px' }}
      >
        {t('faqTitleShort')}
      </Typography>
      {faqData?.map((item: any, index: number) => (
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
                <ICONS.ADD size={24} color='primary.secondary' />
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
              '&.Mui-expanded': {
                borderBottom: 'none',
              },
              '& .MuiAccordionSummary-content': {
                margin: { xs: '12px 0', md: '16px 0' },
              },
            }}
          >
            <Typography fontWeight={500} fontSize={16} pr={2}>
              {item.question}
            </Typography>
          </StyledAccordionSummary>

          <StyledAccordionDetails>
            <Typography
              fontSize={16}
              fontWeight={400}
              color='primary.typography'
            >
              {item.answer.includes('{email}')
                ? t.rich(`faq.${index}.answer`, {
                    email: SUPPORT_MAIL,
                    a: chunks => (
                      <StyledLink href={`mailto:${SUPPORT_MAIL}`}>
                        {chunks}
                      </StyledLink>
                    ),
                  })
                : item.answer}
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </Container>
  );
};

export default FAQ;
