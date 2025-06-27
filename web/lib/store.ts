import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import profileReducer from './features/profile/profileSlice';
import matchingReducer from './features/matching/matchingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    matching: matchingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;