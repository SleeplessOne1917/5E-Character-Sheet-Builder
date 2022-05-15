import { configureStore, createSlice } from '@reduxjs/toolkit';

import { AbilityScore } from '../../../redux/features/abilityScores';
import AbilityScores from '../../../types/abilityScores';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';

const defaultInitialState: { abilityScores: AbilityScoresState } = {
	abilityScores: {
		str: {
			base: 12
		},
		dex: {
			base: 8,
			abilityImprovement: 4
		},
		cha: { base: 15, raceBonus: 2 },
		con: { override: 10 },
		int: { otherBonus: 5 },
		wis: { base: 14, override: 25 }
	}
};

const getMockStore = (index: AbilityScores, overrideValues: AbilityScore) => {
	const initialState = {
		abilityScores: {
			...defaultInitialState.abilityScores,
			[index]: {
				...defaultInitialState.abilityScores[index],
				...overrideValues
			}
		}
	};

	const mockEditingCharacterSlice = createSlice({
		name: 'editingCharacter',
		initialState: initialState,
		reducers: {}
	});

	return configureStore({
		reducer: { editingCharacter: mockEditingCharacterSlice.reducer }
	});
};

const MockStore = ({
	overrideValues = {},
	index,
	children
}: {
	overrideValues?: AbilityScore;
	index: AbilityScores;
	children: ReactNode;
}) => (
	<Provider store={getMockStore(index, overrideValues)}>{children}</Provider>
);

export default MockStore;

export const mockAbilities = [
	{ index: 'str', full_name: 'Strength' },
	{ index: 'dex', full_name: 'Dexterity' },
	{ index: 'con', full_name: 'Constitution' },
	{ index: 'int', full_name: 'Intelligence' },
	{ index: 'wis', full_name: 'Wisdom' },
	{ index: 'cha', full_name: 'Charisma' }
];
