import { useCallback } from 'react';

const Form = ({ children, handleSubmit, sx, style, ...props }: any) => {
  const onSubmit = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!handleSubmit) return;
      handleSubmit(e);
    },
    [handleSubmit]
  );

  return (
    <form {...props} style={{ ...style, ...sx }} {...{ onSubmit }}>
      {children}
    </form>
  );
};

export default Form;
