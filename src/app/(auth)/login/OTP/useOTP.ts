import { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import useToast from '../../../../hooks/useToast';
import { otpValidationSchema } from '../../../../assets/utils/validations';
import { api } from '../../../../api';
import { resetOTPKey, setActiveUI, updateUser } from '../../../../redux/slices/auth.slice';
import { decodeToken } from '../../../../assets/utils/function';
import { URLS as PAGES } from '../../../../constant/urls';
import useHistory from '../../../../hooks/useHistory';
import { AuthContext } from '../../../../contexts/AuthContext';
import { DOMAIN } from '../../../../constant';
import useSocket from '../../../../hooks/use-socket';

const useOTP = () => {
    const { setToken } = useContext(AuthContext);
    const { updateSocketOnLogin } = useSocket();

    const [remainingTime, setRemainingTime] = useState(45);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const { handleToast } = useToast();
    const { user, redirect } = useSelector(({ auth }) => auth);
    const dispatch = useDispatch();
    const history = useHistory();

    const { values, errors, setValues, handleSubmit } = useFormik({
        initialValues: {
            otp: ''
        },
        validationSchema: otpValidationSchema,
        onSubmit: async (value) => {
            await handleSubmitOTP(value);
        }
    });

    useEffect(() => {
        if (remainingTime > 0) {
            setIsResendDisabled(true);
            const timerId = setInterval(() => {
                setRemainingTime((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timerId);
        } else {
            setIsResendDisabled(false);
        }
    }, [remainingTime]);

    const handleSubmitOTP = useCallback(
        async ({ otp }) => {
            if (isLoading) return;
            setIsLoading(true);
            try {
                if (redirect === 'new-password') {
                    const response = await api.auth.verifyOtp({
                        data: { otp, email: user?.email }
                    });
                    if (response?.data?.data?.resetKey) {
                        dispatch(resetOTPKey({ resetKey: response?.data?.data?.resetKey }));
                        dispatch(setActiveUI('RESET_PASSWORD'));
                        history(PAGES.FORGOT_PASSWORD.path);
                        handleToast({ message: response?.data?.message, variant: 'success' });
                    }
                } else {
                    const response = await api.auth.verify({
                        data: { email: user?.email, otp }
                    });
                    if (response?.data) {
                        const decodeData = decodeToken(response?.data?.data?.token);
                        if (response?.data?.data?.token) {
                            setToken(response?.data?.data?.token);
                            updateSocketOnLogin(response?.data?.data?.token);
                        }

                        dispatch(
                            updateUser({
                                token: response?.data?.data?.token,
                                activeUI: '',
                                ...user,
                                ...decodeData
                            })
                        );
                        handleToast({ message: response?.data?.message, variant: 'success' });
                    }
                }
            } catch (error) {
                handleToast({
                    message: error?.data?.message || error?.message || 'Something went wrong.',
                    variant: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        },
        [dispatch, handleToast, history, isLoading, redirect, setToken, updateSocketOnLogin, user]
    );

    const handleChange = useCallback(
        async (e) => {
            const { name, value } = e.target;
            setValues({
                ...values,
                [name]: value
            });
        },
        [setValues, values]
    );

    useEffect(() => {
        if (values.otp.length === 6 && !errors.otp) {
            handleSubmit();
        }
    }, [values.otp, errors.otp, handleSubmit]);

    const handleResendClick = useCallback(async () => {
        if (isLoading) return;
        try {
            const response = await api.auth.resend({
                data: { email: user?.email, domain: DOMAIN }
            });
            if (response?.data) {
                handleToast({ message: response?.data?.message, variant: 'success' });
                setRemainingTime(45);
            }
        } catch (error) {
            handleToast({
                message: error?.data?.message || 'Something went wrong.',
                variant: 'error'
            });
        }
    }, [handleToast, isLoading, user?.email]);

    return {
        values,
        handleResendClick,
        user,
        errors,
        handleSubmit,
        handleChange,
        isLoading,
        remainingTime,
        isResendDisabled
    };
};

export default useOTP;
