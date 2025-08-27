import { useState } from 'react';
import moment from 'moment';
import {
    Paper,
    Typography,
    IconButton,
    Box,
    Divider,
    Tooltip,
    styled,
    useMediaQuery
} from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { IMAGES } from '@/assets/images';
import { ICONS } from '@/assets/icons';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const CalendarContainer = styled(Paper)(({ theme }) => ({
    width: '100%',
    boxShadow: 'none',
    padding: theme.spacing(2),
    borderRadius: 0,
    [theme.breakpoints.down('sm')]: {
        backgroundColor: 'transparent',
        padding: theme.spacing(0)
    },
    [theme.breakpoints.up('sm')]: {
        backgroundColor: '#FFFFFF'
    }
}));

const CalendarHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
}));

const StreakContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1)
}));

const StreakText = styled(Typography)(() => ({
    color: '#304BE0'
}));

const StyledPickersDay = styled(PickersDay)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover
    }
}));

const StyledStaticDatePicker = styled(StaticDatePicker)(({ theme }) => ({
    '.MuiDateCalendar-root': {
        width: '100%',
        margin: 0,
        minWidth: 'auto !important'
    },
    '.MuiPickersCalendarHeader-root': {
        justifyContent: 'space-between',
        padding: theme.spacing(0, 2),
        marginBottom: theme.spacing(1)
    },
    '.MuiDayCalendar-header': {
        margin: 0,
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        justifyItems: 'center'
    },
    '.MuiPickersDay-root': {
        margin: '0 auto',
        width: '36px',
        height: '36px',
        fontSize: '14px'
    },
    '.MuiPickersDay-root.Mui-selected.Mui-disabled': {
        backgroundColor: '#BBBBBB80'
    },
    '.MuiPickersDay-root:hover': {
        backgroundColor: '#E3EFFF'
    },
    '.MuiPickersSlideTransition-root': {
        minHeight: '300px'
    }
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderColor: '#BBBBBB80',
    opacity: 0.5,
    borderWidth: '1px'
}));

const TrainingCalendar = ({ dashboardData, isDisabled }: any) => {
    const today = moment();
    const t = useTranslations();
    const { CALENDAR_DATA, totalLoginDaysCount } = dashboardData;

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(today);

    const isMobileOrTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const trainingDays = CALENDAR_DATA?.map((data: any) => moment(data?.login_date));

    const isTrainingDay = (date: any) => {
        if (!date) return false;

        const dateString = moment(date).format('YYYY-MM-DD');

        return trainingDays.some(
            (trainingDate: any) => trainingDate.format('YYYY-MM-DD') === dateString
        );
    };

    const handleTooltipClose = () => {
        setTooltipOpen(false);
    };

    const handleTooltipOpen = () => {
        if (isMobileOrTablet) {
            setTooltipOpen(!tooltipOpen);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <CalendarContainer>
                <CalendarHeader>
                    <Typography sx={{ fontSize: '18px', fontWeight: 500 }}>
                        {t('training_calendar')}
                    </Typography>
                    <Tooltip
                        title="Calendar Information"
                        open={isMobileOrTablet ? tooltipOpen : undefined}
                        onClose={handleTooltipClose}
                    >
                        <IconButton size="small" onClick={handleTooltipOpen}>
                            <ICONS.QuestionCircle />
                        </IconButton>
                    </Tooltip>
                </CalendarHeader>

                <StyledDivider />

                <StyledStaticDatePicker
                    readOnly={isDisabled}
                    displayStaticWrapperAs="desktop"
                    value={currentDate}
                    onChange={(newDate: any) => setCurrentDate(newDate)}
                    dayOfWeekFormatter={(day) => moment(day).format('ddd')}
                    slotProps={{
                        layout: {
                            sx: {
                                minWidth: 'auto'
                            }
                        },
                        calendarHeader: {
                            sx: {
                                '& .MuiPickersCalendarHeader-label': {
                                    pointerEvents: 'none',
                                    cursor: 'default'
                                },
                                '& .MuiPickersCalendarHeader-switchViewButton': {
                                    display: 'none'
                                }
                            }
                        },
                        toolbar: {
                            hidden: true
                        }
                    }}
                    slots={{
                        day: (props) => {
                            const isDateToday = moment(props.day).isSame(moment(), 'day');
                            const isDateTraining = isTrainingDay(props.day);
                            return (
                                <StyledPickersDay
                                    {...props}
                                    sx={{
                                        ...(isDateTraining && {
                                            borderRadius: '50%',
                                            backgroundColor: '#304BE0 !important',
                                            color: '#FFFFFF !important'
                                        }),
                                        ...(isDateToday && {
                                            borderRadius: '50%',
                                            border: '2px solid #304BE0 !important',
                                            backgroundColor: '#FFFFFF !important',
                                            color: '#000000 !important'
                                        })
                                    }}
                                />
                            );
                        }
                    }}
                    views={['day']}
                    autoFocus={false}
                />

                <StyledDivider />

                <StreakContainer>
                    <Typography variant="subtitle1" sx={{ mr: 1 }}>
                        {t('current_streak')}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image
                            src={IMAGES.FireCircle}
                            alt="Fire Icon"
                            width={20}
                            height={20}
                            style={{ marginRight: '8px' }}
                        />
                        <StreakText variant="subtitle1">
                            {totalLoginDaysCount} {totalLoginDaysCount > 1 ? t('days') : t('day')}
                        </StreakText>
                    </Box>
                </StreakContainer>

                <StyledDivider sx={{ marginBottom: 0 }} />
            </CalendarContainer>
        </LocalizationProvider>
    );
}

export default TrainingCalendar;
