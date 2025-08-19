import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmptyObject } from '@utils/helper';

const useAccessPlan = ({data}) => {
    const loading = false;

    const [activeLandingPage, setActiveLandingPage] = useState({});

    const dispatch = useDispatch();

    useEffect(() => {
        if (data?.landing_name && !isEmptyObject(data?.landing_name)) {
            setActiveLandingPage(data?.landing_name);
        }
    }, [data, setActiveLandingPage]);

    return {
        loading,
        course: data?.course || {},
        activeLandingPage,
        dispatch,
        course_id: data?.course?.id
    };
};

export default useAccessPlan;
