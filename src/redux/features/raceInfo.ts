import { AbilityBonus, SrdItem } from './../../types/srd';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SrdRace, SrdSubrace } from '../../types/srd';

export type RaceInfoState = {
	race?: SrdRace;
	subrace?: SrdSubrace;
	selectedAbilityScoreBonuses?: AbilityBonus[];
	selectedLanguages?: SrdItem[];
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
		deselectRace: () => {
			return {};
		},
		selectAbilityBonuses: (state, action: PayloadAction<AbilityBonus[]>) => {
			state.selectedAbilityScoreBonuses = action.payload;
		},
		deselectAbilityBonuses: state => {
			state.selectedAbilityScoreBonuses = undefined;
		},
		selectLanguages: (state, action: PayloadAction<SrdItem[]>) => {
			state.selectedLanguages = action.payload;
		},
		deselectLanguages: state => {
			state.selectedLanguages = undefined;
		}
	}
});

export const {
	selectRace,
	deselectRace,
	selectAbilityBonuses,
	deselectAbilityBonuses,
	selectLanguages,
	deselectLanguages
} = raceInfoSlice.actions;
export default raceInfoSlice.reducer;
