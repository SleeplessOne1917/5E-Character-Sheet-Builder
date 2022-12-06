import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { deepClone, deepMerge } from '../../services/objectService';

import { DeepPartial } from '../../types/helpers';

export type AutoLevelType = 'off' | 'roll' | 'average';

export type HPState = {
	autoLevel: AutoLevelType;
	levelHPBonuses: (number | null)[];
};

export const initialState: HPState = {
	autoLevel: 'off',
	levelHPBonuses: []
};

export const createHPSlice = (
	overrideInitialState: DeepPartial<HPState> = {}
) =>
	createSlice({
		name: 'hp',
		initialState: deepMerge<HPState>(
			deepClone(initialState),
			overrideInitialState
		),
		reducers: {
			setAutoLevel: (state, { payload }: PayloadAction<AutoLevelType>) => {
				state.autoLevel = payload;
			},
			addLevelHPBonus: (state, { payload }: PayloadAction<number | null>) => {
				state.levelHPBonuses = [...state.levelHPBonuses, payload];
			},
			removeLevelHPBonus: state => {
				state.levelHPBonuses = state.levelHPBonuses.slice(
					0,
					state.levelHPBonuses.length - 1
				);
			},
			setLevelHpBonus: (
				state,
				{
					payload: { index, bonus }
				}: PayloadAction<{ index: number; bonus: number | null }>
			) => {
				if (state.levelHPBonuses.length < index + 1) {
					for (let i = 0; i < index + 1 - state.levelHPBonuses.length; ++i) {
						state.levelHPBonuses = [...state.levelHPBonuses, null];
					}
				}

				state.levelHPBonuses[index] = bonus;
			}
		}
	});

const hpSlice = createHPSlice();
s;

export const {
	setAutoLevel,
	addLevelHPBonus,
	removeLevelHPBonus,
	setLevelHpBonus
} = hpSlice.actions;

export default hpSlice.reducer;
