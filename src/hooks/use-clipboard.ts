import { useState, useCallback, useEffect, useRef } from 'react';
import { logError } from '@/utils/helper';

const useClipboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const copyToClipboard = useCallback(async (text: any) => {
        try {
            setIsLoading(true);

            // Check if clipboard API is available
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    document.execCommand('copy');
                } catch (fallbackError) {
                    logError('Fallback copy failed:', fallbackError);
                    throw new Error('Copy to clipboard not supported');
                } finally {
                    document.body.removeChild(textArea);
                }
            }

            setIsCopied(true);

            // Reset isCopied after a delay
            timeoutRef.current = setTimeout(() => {
                setIsCopied(false);
            }, 2000); // 2 seconds delay
        } catch (error) {
            logError(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Cleanup the timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return [copyToClipboard, isLoading, isCopied];
};

export default useClipboard;
