"use client"
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { ERROR_MESSAGES } from '@/utils/constants';

const useAsyncOperation = (operation: any) => {
    const [loading, setLoading] = useState(false);

    const executeOperation = async (params: any) => {
        setLoading(true);
        try {
            const result = await operation(params);
            return result;
        } catch (error) {
            enqueueSnackbar((error as Error)?.message || ERROR_MESSAGES.common, { variant: 'error' });
            return null;
        } finally {
            setLoading(false);
        }
    };

    const hookData = [executeOperation, loading];
    return hookData;
};

export default useAsyncOperation;
