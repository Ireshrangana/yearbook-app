import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import yearbookReducer from './slices/yearbookSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    yearbook: yearbookReducer,
  },
});