import { createSlice } from '@reduxjs/toolkit';

const initialState = 'MuhUsername' as string | null;

const viewerSlice = createSlice({
	name: 'viewer',
	initialState,
	reducers: {}
});

export default viewerSlice.reducer;
