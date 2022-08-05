import { AbilityBonus } from './../../types/srd';
import { SrdRace, SrdSubrace } from '../../types/srd';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type RaceInfoState = {
	race?: SrdRace;
	subrace?: SrdSubrace;
	selectedAbilityScoreBonuses?: AbilityBonus[];
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
			state.selectedAbilityScoreBonuses = undefined;
		},
		selectAbilityBonuses: (state, action: PayloadAction<AbilityBonus[]>) => {
			state.selectedAbilityScoreBonuses = action.payload;
		},
		deselectAbilityBonuses: state => {
			state.selectedAbilityScoreBonuses = undefined;
		}
	}
});

export const {
	selectRace,
	deselectRace,
	selectAbilityBonuses,
	deselectAbilityBonuses
} = raceInfoSlice.actions;
export default raceInfoSlice.reducer;
