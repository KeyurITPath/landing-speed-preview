import { Box } from '@mui/material';
import useAccessPlan from './useAccessPlan';
import { OVERRIDE } from '../../../../../theme/basic';
import CustomButton from '@shared/button';
import { initial } from '../../../../../theme/color';
import { getAccessOpen } from '@store/features/course.slice';
import { useTranslations } from 'next-intl';

const AccessPlan = ({ landingData }) => {
  const {
    isBecomeAMemberWithVerified,
    handleStartFree,
    isBecomeVerifiedAndSubscribed,
    isUserPurchasedCourse,
    handleProceedToWatch,
    course,
  } = landingData;

  const { dispatch, course_id, data } = useAccessPlan({
    course,
    otherData: landingData?.data,
  });
  const t = useTranslations();

  return (
    <>
      {course?.id && (
        <Box
          sx={{
            width: '100%',
            ...OVERRIDE().FLEX,
            boxShadow: '0px -1px 15px 0px #00000014',
            background: initial.white,
            py: 2,
            px: 3,
            zIndex: 99,
            position: 'sticky',
            bottom: 0,
            left: 0,
          }}
        >
          <CustomButton
            sx={{
              borderRadius: '5px',
              minHeight: '40px',
              width: { xs: '100%', sm: '100px' },
              display: 'flex',
              flexDirection: 'column',
              fontSize: 14,
              fontWeight: 600,
              px: 4,
            }}
            onClick={() => {
              if (isUserPurchasedCourse || isBecomeVerifiedAndSubscribed) {
                handleProceedToWatch();
              } else if (isBecomeAMemberWithVerified) {
                handleStartFree(course_id, data?.header);
              } else {
                dispatch(getAccessOpen());
              }
            }}
            variant='gradient'
          >
            {isUserPurchasedCourse || isBecomeVerifiedAndSubscribed
              ? t('proceed_to_watch')
              : isBecomeAMemberWithVerified
                ? t('try_for_free')
                : t('buy')}
          </CustomButton>
        </Box>
      )}
    </>
  );
};

export default AccessPlan;
