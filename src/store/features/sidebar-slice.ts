import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    isSidebarOpen: false
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        }
    }
});

export const { setSidebarOpen, toggleSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
