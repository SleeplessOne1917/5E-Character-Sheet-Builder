import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import GET_VIEWER from '../../graphql/queries/getViewer';
import { ToastType } from '../../types/toast';
import { createAuthClient } from './../../graphql/client';
import { show } from './toast';

const initialState = null as string | null;

export const fetchLoggedInUsername = createAsyncThunk(
	'viewer/fetchLoggedInUsername',
	async (arg, { rejectWithValue, dispatch }) => {
		const result = await createAuthClient()
			.query<{ viewer: string }>(GET_VIEWER, undefined)
			.toPromise();

		if (result.error) {
			const toast = {
				closeTimeoutSeconds: 10,
				message: result.error.message.toLowerCase().includes('mongoose')
					? 'Could not connect to DB.'
					: result.error.message,
				type: ToastType.error
			};
			dispatch(show(toast));
			return rejectWithValue(`${result.error.message}`);
		}

		return result.data?.viewer ?? null;
	}
);

const viewerSlice = createSlice({
	name: 'viewer',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(
			fetchLoggedInUsername.fulfilled,
			(state, { payload }) => payload
		);
		builder.addCase(fetchLoggedInUsername.rejected, () => null);
	}
});

export default viewerSlice.reducer;
