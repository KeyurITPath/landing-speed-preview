import { useState } from 'react';

const useToggleState = (initialState = false) => {
  const [state, setState] = useState(initialState);

  const close = () => {
    setState(false);
  };

  const open = (data: any) => {
    setState(data || true);
  };

  const toggle = () => {
    setState(state => !state);
  };

  const hookData = [state, open, close, toggle];
  return hookData;
};

export default useToggleState;
