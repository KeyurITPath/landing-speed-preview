'use client';

import { useRef } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useSelector } from 'react-redux';

const CustomPhoneInput = ({
  name,
  disabled,
  handleBlur,
  handleChange,
  error,
  ...props
}: any) => {
  const elementRef = useRef<HTMLInputElement>(null);
  const width = elementRef.current ? elementRef.current?.offsetWidth : 0;

  const { country } = useSelector((state: any) => state.defaults);
  const { country_code } = country || {};

  return (
    <PhoneInput
      {...{ disabled }}
      country={country_code || 'us'}
      inputProps={{ name, ref: elementRef }}
      onBlur={handleBlur}
      onChange={value => {
        handleChange({ target: { name, value } });
      }}
      inputClass={error ? 'custom-phone-input-error' : 'custom-phone-input'}
      buttonClass='custom-phone-input-button'
      dropdownClass='custom-phone-input-dropdown custom-scrollbar'
      dropdownStyle={{ width: `${width}px` }}
      {...props}
    />
  );
};

export default CustomPhoneInput;

