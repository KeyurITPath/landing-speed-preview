import React from 'react';
import { useState, useCallback, useMemo } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  styled,
} from '@mui/material';
import { ICONS } from '@/assets/icons';
import { useTranslations } from 'next-intl';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
  backgroundColor: '#F0F0F0',
  borderRadius: '8px !important',
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
  padding: theme.spacing(2, 3),
  '& .MuiAccordionSummary-content': {
    margin: '0',
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    padding: theme.spacing(0.6),
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
  padding: theme.spacing(1, 3, 3, 3),
}));

const AcademicPlan = ({ data }: any) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const t = useTranslations();

  const handleChange = useCallback(
    (panel: any) => (event: any, isExpanded: boolean | any) => {
      setExpanded(isExpanded ? panel : false);
    },
    []
  );

  const academicPlan = useMemo(() => {
    return data?.landing_page_lessons?.length
      ? data?.landing_page_lessons?.map((lesson: any) => ({
          id: lesson?.id,
          title: lesson?.ap_title,
          description: lesson?.ap_description,
        }))
      : [];
  }, [data?.landing_page_lessons]);

  return (
    <Container maxWidth='md' sx={{ py: { xs: 2, md: 4 } }}>
      <Typography
        color='primary.typography'
        fontWeight={500}
        fontSize={28}
        mt={2}
        mb={2}
      >
        {t('academic_plan')}
      </Typography>
      <Typography
        fontWeight={400}
        fontSize={16}
        mb={3.75}
        color='primary.typography'
        dangerouslySetInnerHTML={{
          __html: data?.academic_plan_description || '',
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

      {academicPlan?.map((module: any) => (
        <StyledAccordion
          key={module?.id}
          expanded={expanded === `panel${module?.id}`}
          onChange={handleChange(`panel${module?.id}`)}
        >
          <StyledAccordionSummary
            expandIcon={
              expanded === `panel${module?.id}` ? (
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
            aria-controls={`panel${module?.id}-content`}
            id={`panel${module?.id}-header`}
          >
            <Typography fontWeight={500} fontSize={16}>
              {module?.title}
            </Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography whiteSpace='break-spaces' fontSize={16}>
              {module?.description}
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </Container>
  );
};

export default AcademicPlan;
