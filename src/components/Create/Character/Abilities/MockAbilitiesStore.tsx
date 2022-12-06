'use client';

import {
	AbilityScoresState,
	createAbilityScoreSlice
} from '../../../../redux/features/abilityScores';
import { AnyAction, Reducer } from '@reduxjs/toolkit';
import {
	EditingCharacterState,
	createEditingCharacterReducer
} from '../../../../redux/features/editingCharacter';

import { AbilityItem } from '../../../../types/srd';
import { DeepPartial } from '../../../../types/helpers';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { deepMerge } from '../../../../services/objectService';
import { getTestStore } from '../../../../redux/store';

const defaultInitialState: AbilityScoresState = {
	str: {
		base: 12,
		highest: 20,
		abilityImprovement: 0
	},
	dex: {
		base: 8,
		abilityImprovement: 4,
		highest: 20
	},
	cha: { base: 15, raceBonus: 2, highest: 20, abilityImprovement: 0 },
	con: { override: 10, abilityImprovement: 0, highest: 20 },
	int: { otherBonus: 5, abilityImprovement: 0, highest: 20 },
	wis: { base: 14, override: 25, abilityImprovement: 0, highest: 20 }
};

const MockStore = ({
	overrideValues = {},
	children
}: {
	overrideValues?: DeepPartial<AbilityScoresState>;
	children: ReactNode;
}) => (
	<Provider
		store={getTestStore({
			editingCharacter: createEditingCharacterReducer({
				abilityScores: createAbilityScoreSlice(
					deepMerge(defaultInitialState, overrideValues)
				).reducer
			}) as Reducer<EditingCharacterState, AnyAction>
		})}
	>
		{children}
	</Provider>
);

export default MockStore;

export const mockAbilities: AbilityItem[] = [
	{ index: 'str', full_name: 'Strength' },
	{ index: 'dex', full_name: 'Dexterity' },
	{ index: 'con', full_name: 'Constitution' },
	{ index: 'int', full_name: 'Intelligence' },
	{ index: 'wis', full_name: 'Wisdom' },
	{ index: 'cha', full_name: 'Charisma' }
];
