import { SrdRace, SrdSubrace } from '../../types/srd';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type RaceInfoState = {
	race?: SrdRace;
	subrace?: SrdSubrace;
};

type SelectPayload = {
	race: SrdRace;
	subrace?: SrdSubrace;
};

export const initialState: RaceInfoState = {
	race: undefined,
	subrace: undefined
};

const raceInfoSlice = createSlice({
	name: 'raceInfo',
	initialState,
	reducers: {
		selectRace: (state, action: PayloadAction<SelectPayload>) => {
			const { race, subrace } = action.payload;
			state.race = race;

			if (subrace) {
				state.subrace = subrace;
			}
		},
		deselectRace: state => {
			state.race = undefined;
			state.subrace = undefined;
		}
	}
});

export const { selectRace, deselectRace } = raceInfoSlice.actions;
export default raceInfoSlice.reducer;
