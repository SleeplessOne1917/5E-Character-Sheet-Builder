import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './features/toast';
import viewerReducer from './features/viewer';

export const store = configureStore({
	reducer: {
		toast: toastReducer,
		viewer: viewerReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
