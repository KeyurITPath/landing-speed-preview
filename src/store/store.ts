import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice, {
  initialState as authInitialState,
} from './features/auth.slice';
import courseSlice, {
  initialState as courseInitialState,
} from './features/course.slice';
import userSlice, {
  initialState as userInitialState,
} from './features/user.slice';
import popupSlice, {
  initialState as popupInitialState,
} from './features/popup.slice';
import defaultsSlice, {
  initialState as defaultsInitialState,
} from './features/defaults.slice';
import homeSlice, {
  initialState as homeInitialState,
} from './features/home.slice';
import courseCategoriesSlice, {
  initialState as courseCategoriesInitialState,
} from './features/course-categories.slice';
import dashboardSlice, {
  initialState as dashboardInitialState,
} from './features/dashboard.slice';
import countriesSlice, {
  initialState as countriesInitialState,
} from './features/countries.slice';
import sidebarSlice, {
  initialState as sidebarInitialState,
} from './features/sidebar-slice';
import courseDetailsSlice, {
  initialState as courseDetailsInitialState,
} from './features/course-details.slice';
import widgetScriptSlice, {
  initialState as widgetScriptInitialState,
} from './features/widget-script.slice';
import trialsActivationSlice, {
  initialState as trialsActivationInitialState,
} from './features/trials-activation.slice';
import { localStorageMiddleware } from './middleware/localStorage.middleware';

export const reducers = combineReducers({
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
  trialsActivation: trialsActivationSlice,
});

const initialStore = {
  auth: authInitialState,
  course: courseInitialState,
  user: userInitialState,
  popup: popupInitialState,
  defaults: defaultsInitialState,
  home: {
    ...homeInitialState,
    popularCoursesOnBrand: {
      ...homeInitialState.popularCoursesOnBrand,
      loading: true,
    },
  },
  courseCategories: courseCategoriesInitialState,
  dashboard: dashboardInitialState,
  countries: countriesInitialState,
  sidebar: sidebarInitialState,
  courseDetails: courseDetailsInitialState,
  widgetScript: widgetScriptInitialState,
  trialsActivation: trialsActivationInitialState,
};

export const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET') {
    return initialStore;
  }
  return reducers(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionsPaths: ['payload', 'error'],
        ignoredPaths: ['register'],
      },
    }).concat(localStorageMiddleware),
});
