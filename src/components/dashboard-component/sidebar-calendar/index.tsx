import { Box, Grid2 } from '@mui/material';
import TolstoyWidget from '../../tolstoy-widget';
import TrainingCalendar from './components/TrainingCalendar';
import { TOLSTOY_COMMENT_LAST_KEY } from '@/utils/constants';

const SidebarCalendar = ({ dashboardData }: any) => {
    return (
        <Grid2
            size={{ xs: 12, md: 4, lg: 3.5 }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1, sm: 2 }
            }}
        >
            <Box px={{ xs: 1, sm: 0 }}>
                <TrainingCalendar isDisabled {...{ dashboardData }} />
                <TolstoyWidget
                    maxHeight="800px"
                    miniWidget={true}
                    commentLastKey={TOLSTOY_COMMENT_LAST_KEY}
                    commentTake={5}
                    commentInterval="month"
                    commentTitle="Recent Comments"
                    dynamicScript={`<script type="text/javascript">!(function(w,d,s,l,x){w[l]=w[l]||[];w[l].t=w[l].t||new Date().getTime();var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=!0;j.src='//web.tolstoycomments.com/sitejs/app.js?i='+l+'&x='+x+'&t='+w[l].t;f.parentNode.insertBefore(j,f);})(window,document,'script','tolstoycomments','6321');</script>`}
                />
            </Box>
        </Grid2>
    );
};

export default SidebarCalendar;
