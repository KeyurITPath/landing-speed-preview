import React from 'react';
import { Grid2, Typography } from '@mui/material';

const CourseDetailsForWillYouNeed = ({ data }) => {
    return (
        <React.Fragment>
            <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12 }}>
                        <Typography
                            color="primary.typography"
                            fontWeight={500}
                            fontSize={{ xs: 22, sm: 24 }}
                        >
                            {data?.need_for_the_course_label || ''}
                        </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        <Typography
                            whiteSpace="break-spaces"
                            fontWeight={400}
                            fontSize={16}
                            color="primary.typography"
                        >
                            {data?.need_for_the_course || ''}
                        </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        <Typography
                            fontWeight={400}
                            fontSize={16}
                            color="primary.typography"
                            dangerouslySetInnerHTML={{
                                __html: data?.nc_bullet_points || ''
                            }}
                            sx={{
                                '& ul': {
                                    listStyleType: 'disc',
                                    marginLeft: 2,
                                    paddingLeft: 2
                                },
                                '& li': {
                                    display: 'list-item'
                                },
                                whiteSpace: 'break-spaces'
                            }}
                        />
                    </Grid2>
                </Grid2>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12 }}>
                        <Typography
                            whiteSpace="break-spaces"
                            color="primary.typography"
                            fontWeight={500}
                            fontSize={{ xs: 22, sm: 24 }}
                        >
                            {data?.nc_header_2_title || ''}
                        </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        <Typography
                            fontWeight={400}
                            fontSize={16}
                            color="primary.typography"
                            dangerouslySetInnerHTML={{
                                __html: data?.nc_description_2 || ''
                            }}
                            sx={{
                                '& ul': {
                                    listStyleType: 'disc',
                                    marginLeft: 2,
                                    paddingLeft: 2
                                },
                                '& li': {
                                    display: 'list-item'
                                },
                                whiteSpace: 'break-spaces'
                            }}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        <Typography
                            fontWeight={400}
                            fontSize={16}
                            color="primary.typography"
                            dangerouslySetInnerHTML={{
                                __html: data?.nc_short_description || ''
                            }}
                            sx={{
                                '& ul': {
                                    listStyleType: 'disc',
                                    marginLeft: 2,
                                    paddingLeft: 2
                                },
                                '& li': {
                                    display: 'list-item'
                                },
                                whiteSpace: 'break-spaces'
                            }}
                        />
                    </Grid2>
                </Grid2>
            </Grid2>
        </React.Fragment>
    );
};

export default CourseDetailsForWillYouNeed;
