import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type GenerationMethodState = 'manual' | 'roll' | 'point-buy' | 'array';

type GenerationMethodPayload = {
	generationMethod: GenerationMethodState;
};

const initialState = 'roll' as GenerationMethodState;

const generationMethodSlice = createSlice({
	name: 'generationMethod',
	initialState,
	reducers: {
		updateGenerationMethod: (
			state,
			action: PayloadAction<GenerationMethodPayload>
		) => action.payload.generationMethod
	}
});

export const { updateGenerationMethod } = generationMethodSlice.actions;

export default generationMethodSlice.reducer;
