'use client';

import { useRef } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CustomPhoneInput = ({
  name,
  // color,
  disabled,
  // size,
  handleBlur,
  handleChange,
  error,
  ...props
}: any) => {
  const elementRef = useRef<HTMLInputElement>(null);
  const width = elementRef.current ? elementRef.current?.offsetWidth : 0;
  return (
    <PhoneInput
      {...{ disabled }}
      country={'us'}
      inputProps={{ name, ref: elementRef }}
      onBlur={handleBlur}
      // onChange={(value, country, e, formattedValue) => {
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
