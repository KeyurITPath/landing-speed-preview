import { useDispatch } from 'react-redux';

const useAccessPlan = ({ course, otherData }) => {
    const dispatch = useDispatch();
    return {
        data: otherData,
        dispatch,
        course_id: course?.id || '',
    };
};

export default useAccessPlan;
