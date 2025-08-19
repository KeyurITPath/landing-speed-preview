import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  isLoggedIn: false,
  user: {
    subscription_type: '',
    role: null,
    token: '',
    last_login_at: null,
    consecutive_days: 1,
    has_collected_reward: false,
  },
  activeUI: '',
  redirect: null,
  resetKey: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { activeUI, redirect, isLoggedIn, ...data } = action.payload;

      let isLoggedInValue = state.isLoggedIn;

      if (action?.payload.hasOwnProperty('isLoggedIn')) {
        isLoggedInValue = isLoggedIn;
      }
      return {
        ...state,
        activeUI,
        redirect,
        isLoggedIn: isLoggedInValue,
        user: {
          ...state.user,
          ...data,
        },
      };
    },
    updateEmail: (state, action) => {
      const { email } = action.payload;
      return { ...state, user: { ...state.user, email } };
    },
    setActiveUI: (state, action) => {
      state.activeUI = action.payload;
    },
    resetOTPKey: (state, action) => {
      const { resetKey } = action.payload;
      return { ...state, resetKey };
    },
    logout: () => {
      return { ...initialState };
    },
  },
});

export const { updateUser, updateEmail, setActiveUI, logout, resetOTPKey } =
  authSlice.actions;
export default authSlice.reducer;
