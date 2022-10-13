import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ToastType } from '../../types/toast';

export type ToastState = {
	message: string;
	type: ToastType;
	isOpen: boolean;
	closeTimeoutSeconds: number;
};

export type ToastShowPayload = {
	message: string;
	type: ToastType;
	closeTimeoutSeconds: number;
};

const initialState: ToastState = {
	message: '',
	type: ToastType.success,
	isOpen: false,
	closeTimeoutSeconds: 0
};

const toastSlice = createSlice({
	name: 'toast',
	initialState,
	reducers: {
		show: (state, action: PayloadAction<ToastShowPayload>) => {
			return {
				isOpen: true,
				...action.payload
			};
		},
		hide: state => {
			return {
				...state,
				isOpen: false
			};
		}
	}
});

export const { show, hide } = toastSlice.actions;

export default toastSlice.reducer;
