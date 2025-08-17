import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth.slice';
import courseSlice from './features/course.slice';
import userSlice from './features/user.slice';
import popupSlice from './features/popup.slice';
import defaultsSlice from './features/defaults.slice';
import homeSlice from './features/home.slice';
import courseCategoriesSlice from './features/course-categories.slice';
import dashboardSlice from './features/dashboard.slice';
import countriesSlice from './features/countries.slice';
import sidebarSlice from './features/sidebar-slice';
import courseDetailsSlice from './features/course-details.slice';
import widgetScriptSlice from './features/widget-script.slice';
import trialsActivationSlice from './features/trials-activation.slice';
// import other slices here

export function makeStore() {
  return configureStore({
    reducer: {
    auth: authSlice,
    course: courseSlice,
    user: userSlice,
    popup: popupSlice,
    defaults: defaultsSlice,
    home: homeSlice,
    courseCategories: courseCategoriesSlice,
    dashboard: dashboardSlice,
    countries: countriesSlice,
    sidebar: sidebarSlice,
    courseDetails: courseDetailsSlice,
    widgetScript: widgetScriptSlice,
    trialsActivation: trialsActivationSlice
    },
    devTools: process.env.NODE_ENV !== 'production'
  });
}

// Types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Singleton store for CSR
export const store = makeStore();
