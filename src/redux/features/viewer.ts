import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import GET_VIEWER from '../../graphql/queries/getViewer';
import client from '../../graphql/client';

const initialState = null as string | null;

export const fetchLoggedInEmail = createAsyncThunk<string | null, void>(
	'viewer/fetchLoggedInEmail',
	async () => {
		const result = (
			await client
				.query(GET_VIEWER, {}, { requestPolicy: 'network-only' })
				.toPromise()
		).data.viewer as string | null;
		return result;
	}
);

const viewerSlice = createSlice({
	name: 'viewer',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(
			fetchLoggedInEmail.fulfilled,
			(state, action) => action.payload
		);
	}
});

export default viewerSlice.reducer;
