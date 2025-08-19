import { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

const CourseDetailsForWhyChoose = ({ data }) => {

    const [showFullText, setShowFullText] = useState(false);
    const [isTextOverflowing, setIsTextOverflowing] = useState(false);

    const textRef = useRef(null);

    const MAX_LINES = 12;

    useEffect(() => {
        if (textRef.current) {
            const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);
            const maxHeight = MAX_LINES * lineHeight;
            setIsTextOverflowing(Boolean(textRef.current.scrollHeight > maxHeight));
        }
    }, [data?.choose_this_course]);
    const t = useTranslations();
    return (
        <Grid size={{ xs: 12 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography
                        color="primary.typography"
                        fontWeight={500}
                        fontSize={{ xs: 22, sm: 24 }}
                    >
                        {data?.choose_course_heading}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Box
                        ref={textRef}
                        sx={{
                            position: 'relative',
                            display: showFullText ? 'block' : '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: showFullText ? 'none' : MAX_LINES,
                            overflow: 'hidden'
                        }}
                    >
                        <Typography
                            ref={textRef}
                            fontWeight={400}
                            fontSize={16}
                            color="primary.typography"
                            dangerouslySetInnerHTML={{
                                __html: data?.choose_this_course || ''
                            }}
                            sx={{
                                '& ul': {
                                    listStyleType: 'disc',
                                    marginLeft: 2,
                                    paddingLeft: 2
                                },
                                '& li': {
                                    display: 'list-item'
                                }
                            }}
                        />
                    </Box>
                    {isTextOverflowing && (
                        <Button
                            onClick={() => setShowFullText((prev) => !prev)}
                            sx={{
                                mt: 2,
                                color: '#304BE0 !important',
                                fontWeight: 500,
                                fontSize: 16,
                                paddingX: 0,
                                textDecoration: 'underline !important',
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'transparent !important',
                                    opacity: 0.7
                                }
                            }}
                            disableRipple
                            variant="text"
                        >
                            {showFullText ? t('showLessText') : t('showMoreText')}
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CourseDetailsForWhyChoose;
