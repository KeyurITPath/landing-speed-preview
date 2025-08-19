import { useCallback, useState } from 'react';
import {
    accordionSummaryClasses,
    Stack,
    styled,
    Accordion as MuiAccordion,
    AccordionSummary as MuiAccordionSummary,
    Typography,
    AccordionDetails as MuiAccordionDetails,
    Grid
} from '@mui/material';
import CustomButton from '@shared/button';
import { ICONS } from '@assets/icons';
import { useTranslations } from 'next-intl';

const StyledLink = styled('a')(() => ({
    color: '#782fef',
    textDecoration: 'none',
    transition: 'opacity 0.3s',
    '&:hover': {
        opacity: 0.7
    }
}));

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    [`&.${accordionSummaryClasses.expanded}`]: {
        outlineStyle: 'solid',
        outlineWidth: 1,
        outlineColor: theme.palette.primaryNew.main
    },
    borderRadius: 12,
    '&::before': {
        display: 'none'
    },
    backgroundColor: '#f5f6fd'
}));

const AccordionSummary = styled(({ expanded, ...props }) => {
    return (
        <MuiAccordionSummary
            expandIcon={
                <CustomButton
                    color={expanded ? 'primaryNew' : 'secondary'}
                    sx={{
                        borderRadius: '4px',
                        minWidth: 0,
                        p: 0.4,
                        fontSize: 15,
                        color: 'common.white'
                    }}
                >
                    <Stack
                        sx={{
                            transition: 'transform 0.2s ease-in-out',
                            ...(expanded && {
                                transform: 'rotate(180deg)'
                            })
                        }}
                    >
                        <ICONS.AngleDown />
                    </Stack>
                </CustomButton>
            }
            {...props}
        />
    );
})(({ theme }) => ({
    minHeight: 55,
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
        transform: 'rotate(0deg)'
    },
    [`&.${accordionSummaryClasses.expanded}`]: {
        color: theme.palette.primaryNew.main
    },
    gap: theme.spacing(1)
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
}));

const CourseDetailsForFAQ = ({ BRAND_NAME, SUPPORT_MAIL }) => {
    const t = useTranslations();

    const [expanded, setExpanded] = useState({
        general_faq: [],
        pricing_faq: []
    });

    // const GENERAL_FAQS = t('general_faqs', { brand_name: BRAND_NAME, returnObjects: true });
    // const PRICING_FAQS = t('pricing_faqs', { brand_name: BRAND_NAME, returnObjects: true });
    const GENERAL_FAQ_TITLE = t('generalFaqTitle');
    const PRICING_FAQ_TITLE = t('pricingFaqTitle');

    const handleChange = useCallback((category, id) => {
        setExpanded((prev) => ({
            ...prev,
            [category]: prev[category].includes(id) ? prev[category].filter((i) => i !== id) : [id]
        }));
    }, []);

    return (
        <Grid size={{ xs: 12 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography
                        sx={{
                            fontSize: { xs: 26, sm: 28 },
                            fontWeight: 500
                        }}
                        color="primary.typography"
                    >
                        {t('faqTitle')}
                    </Typography>
                </Grid>

                {/* General FAQs */}
                <Grid size={{ xs: 12 }}>
                    <Typography
                        fontSize={{ xs: 16, sm: 16 }}
                        fontWeight={500}
                        sx={{ color: '#304BE0' }}
                    >
                        {GENERAL_FAQ_TITLE}
                    </Typography>
                    <Grid container spacing={2}>
                        {/* {GENERAL_FAQS?.map(({ id, question, answers }, index) => {
                            const isExpanded = expanded.general_faq.includes(id);
                            return (
                                <Grid size={{ xs: 12 }} key={id}>
                                    <Accordion
                                        expanded={isExpanded}
                                        onChange={() => handleChange('general_faq', id)}
                                    >
                                        <AccordionSummary
                                            aria-controls="panel-content"
                                            id={`panel-header-${id}`}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ color: 'inherit' }}
                                            >
                                                {question}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {answers.map((answer, answerIndex) => (
                                                <Typography key={answerIndex} variant="body2">
                                                    {answer.includes('{{email}}') ? (
                                                        <Trans
                                                            i18nKey={`general_faqs.${index}.answers.${answerIndex}`}
                                                            values={{
                                                                email: SUPPORT_MAIL,
                                                                brand_name: BRAND_NAME
                                                            }}
                                                            components={{
                                                                a: (
                                                                    <StyledLink
                                                                        href={`mailto:${SUPPORT_MAIL}`}
                                                                    />
                                                                )
                                                            }}
                                                        />
                                                    ) : (
                                                        answer
                                                    )}
                                                </Typography>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            );
                        })} */}
                    </Grid>
                </Grid>

                {/* Pricing FAQs */}
                <Grid size={{ xs: 12 }}>
                    <Typography
                        fontSize={{ xs: 16, sm: 16 }}
                        fontWeight={500}
                        sx={{ color: '#304BE0' }}
                    >
                        {PRICING_FAQ_TITLE}
                    </Typography>
                    <Grid container spacing={2}>
                        {/* {PRICING_FAQS?.map(({ id, question, answers }, index) => {
                            const isExpanded = expanded.pricing_faq.includes(id);
                            return (
                                <Grid size={{ xs: 12 }} key={id}>
                                    <Accordion
                                        expanded={isExpanded}
                                        onChange={() => handleChange('pricing_faq', id)}
                                    >
                                        <AccordionSummary
                                            aria-controls="panel-content"
                                            id={`panel-header-${id}`}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ color: 'inherit' }}
                                            >
                                                {question}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {answers.map((answer, answerIndex) => (
                                                <Typography key={answerIndex} variant="body2">
                                                    {answer.includes('{{email}}') ? (
                                                        <Trans
                                                            i18nKey={`pricing_faqs.${index}.answers.${answerIndex}`}
                                                            values={{
                                                                email: SUPPORT_MAIL,
                                                                brand_name: BRAND_NAME
                                                            }}
                                                            components={{
                                                                a: (
                                                                    <StyledLink
                                                                        href={`mailto:${SUPPORT_MAIL}`}
                                                                    />
                                                                )
                                                            }}
                                                        />
                                                    ) : (
                                                        answer
                                                    )}
                                                </Typography>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            );
                        })} */}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CourseDetailsForFAQ;
