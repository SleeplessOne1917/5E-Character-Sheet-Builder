import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './features/toast';

export const store = configureStore({
	reducer: {
		toast: toastReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
