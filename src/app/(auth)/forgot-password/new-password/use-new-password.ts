import { useRouter } from "next/navigation";
import { useDomain } from "@/context/domain-provider";
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import { SERVER_URL } from "@/utils/constants";
import { newPasswordValidation, passwordCriteria } from "@/utils/validations";
import { api } from "@/api";
import { setActiveUI } from "@/store/features/auth.slice";
import { useFormik } from "formik";
import { routes } from "@/utils/constants/routes";
import useToast from "@/hooks/use-snackbar";

const useNewPassword = () => {

    const { handleToast } = useToast();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
    const { resetKey, user } = useSelector(({ auth }: any) => auth);

    const router = useRouter();
    const domainDetails = useDomain();

    const { logo, logo_width, logo_height } =
        domainDetails?.data?.domain_detail || {};

    const LOGO_URL = useMemo(() => {
        return logo ? SERVER_URL + logo : null;
    }, [logo]);


     const { values, setValues, errors, handleSubmit, handleBlur, touched } = useFormik({
        initialValues: {
            new_password: '',
            confirm_password: ''
        },
        validationSchema: newPasswordValidation,
        onSubmit: async(values) => {
            if (isAllScenarioCompleted) {
                await handleNewPasswordApi(values);
            } else {
                setShowPasswordTooltip(true);
            }
        }
    });

     const passwordValidation = useMemo(() => {
        return passwordCriteria(values.new_password);
    }, [values.new_password]);

    const isAllScenarioCompleted = useMemo(() => {
        const data = Object.values(passwordValidation);
        return data.every((val) => !!val);
    }, [passwordValidation]);

    const handleChange = useCallback(
        (e: any) => {
            const { name, value } = e.target;
            setValues({ ...values, [name]: value });
        },
        [setValues, values]
    );

        const handleNewPasswordApi = useCallback(
        async (payload: any) => {
            if (isLoading) return;
            setIsLoading(true);
            try {
                const response = await api.auth.resetPassword({
                    data: {
                        email: user?.email,
                        password: payload?.new_password,
                        resetKey
                    }
                });
                if (response?.status === 200) {
                    dispatch(setActiveUI(''));
                    router.push(routes.auth.login);
                    handleToast({
                        message: response?.data?.message,
                        variant: 'success'
                    });
                }
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                handleToast({
                    message:
                        error?.data?.message ||
                        error?.message ||
                        error.response?.errors?.Token?.[0] ||
                        'Something went wrong.',
                    variant: 'error'
                });
            }
        },
        [isLoading, user?.email, resetKey, dispatch, router, handleToast]
    );

    return {
        handleChange,
        showPasswordTooltip,
        setShowPasswordTooltip,
        passwordValidation,
        handleSubmit,
        isLoading,
        values,
        errors,
        handleBlur,
        touched,
        LOGO_URL,
        logo_width,
        logo_height,
        router
    }
}

export default useNewPassword;
