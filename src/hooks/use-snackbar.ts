import { useCallback } from 'react';
import { useSnackbar } from 'notistack';

const useToast = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleToast = useCallback(
        ({ message, ...config }: any) => {
            return enqueueSnackbar(message, { variant: 'default', ...config });
        },
        [enqueueSnackbar]
    );

    return { handleToast };
};

export default useToast;
