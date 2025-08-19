import React, { useCallback } from 'react';
import OTPInput from 'react-otp-input';
import { primary } from '@/theme/color';

const OTPContainer = ({ error, OTPLength = 5, value, handleChange, ...props }: any) => {
    const onChange = useCallback(
        (value: any, name: string) => {
            if (handleChange) {
                handleChange({
                    target: {
                        name,
                        value
                    }
                });
            }
        },
        [handleChange]
    );

    return (
        <OTPInput
            value={value}
            onChange={(value: any) => onChange(value, 'otp')}
            numInputs={OTPLength}
            inputType="number"
            shouldAutoFocus
            renderInput={(props) => (
                <input
                    {...props}
                    style={{
                        outline: 'none',
                        background: 'transparent',
                        height: '45px',
                        fontSize: '22px',
                        borderRadius: '8px',
                        border: `2px solid ${error ? primary.error : '#292F79'}`,
                        marginRight: '8px',
                        textAlign: 'center',
                        transition: 'border-color 0.3s ease',
                        ...props.style,
                        maxWidth: '45px',
                        minWidth: '45px',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#292F79';
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = error ? primary.error : '#292F79';
                        props.onBlur?.(e);
                    }}
                />
            )}
            {...props}
        />
    );
};

export default OTPContainer;

// Re-export ResendOTP for compatibility
export { default as ResendOTP } from './ResendOTP';
