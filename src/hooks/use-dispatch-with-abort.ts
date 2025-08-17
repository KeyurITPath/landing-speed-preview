import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useDispatchWithAbort = (apiFunction) => {
    const [response, setResponse] = useState(null);
    const abortControllerRef = useRef(null);

    const dispatch = useDispatch();

    const fetchData = useCallback(
        (configs) => {
            // Abort the previous request if it exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;
            const signal = controller.signal;

            dispatch(apiFunction({ signal, ...configs })).then((response) => {
                setResponse(response);
            });

            return () => {
                controller.abort();
            };
        },
        [apiFunction, dispatch]
    );

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return [fetchData, response];
};

export default useDispatchWithAbort;
