import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import GET_VIEWER from '../../graphql/queries/getViewer';
import { ToastType } from '../../types/toast';
import client from '../../graphql/client';
import { show } from './toast';

const initialState = null as string | null;

export const fetchLoggedInUsername = createAsyncThunk(
	'viewer/fetchLoggedInUsername',
	async (arg, { rejectWithValue, dispatch }) => {
		const result = await client
			.query(GET_VIEWER, undefined, { requestPolicy: 'cache-and-network' })
			.toPromise();

		if (result.error) {
			const toast = {
				closeTimeoutSeconds: 10,
				message: result.error.message,
				type: ToastType.error
			};
			dispatch(show(toast));
			return rejectWithValue(`${result.error.message}`);
		}

		return result.data.viewer as string;
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
