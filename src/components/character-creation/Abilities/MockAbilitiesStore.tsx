import {
	AbilityPayload,
	AbilityScoresState
} from '../../../redux/features/abilityScores';
import {
	PayloadAction,
	Reducer,
	combineReducers,
	configureStore,
	createSlice
} from '@reduxjs/toolkit';

import {
	EditingCharacterState,
	initialState as editingCharacterInitialState
} from '../../../redux/features/editingCharacter';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import reduceReducers from 'reduce-reducers';
import { AbilityItem } from '../../../types/srd';
import raceInfo from '../../../redux/features/raceInfo';
import languages from '../../../redux/features/languages';
import proficiencies from '../../../redux/features/proficiencies';
import spellcasting from '../../../redux/features/spellcasting';
import classInfo from '../../../redux/features/classInfo';

const defaultInitialState: { abilityScores: AbilityScoresState } = {
	abilityScores: {
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
	}
};

const getMockStore = (overrideValues: Partial<AbilityScoresState>) => {
	const initialState: EditingCharacterState = {
		...editingCharacterInitialState,
		abilityScores: {
			...defaultInitialState.abilityScores,
			...overrideValues
		}
	};

	const mockAbilityScoreSlice = createSlice({
		name: 'abilityScores',
		initialState: initialState.abilityScores as AbilityScoresState,
		reducers: {
			updateBase: (state, action: PayloadAction<AbilityPayload>) => {
				const { value, abilityIndex } = action.payload;
				state[abilityIndex].base = value;
			},
			updateOtherBonus: (state, action: PayloadAction<AbilityPayload>) => {
				const { value, abilityIndex } = action.payload;
				state[abilityIndex].otherBonus = value;
			},
			updateOverride: (state, action: PayloadAction<AbilityPayload>) => {
				const { value, abilityIndex } = action.payload;
				state[abilityIndex].override = value;
			}
		}
	});

	const mockEditingCharacterSlice = createSlice({
		name: 'editingCharacter',
		initialState,
		reducers: {}
	});

	const wholeMockReducer = combineReducers({
		abilityScores: mockAbilityScoreSlice.reducer,
		raceInfo,
		languages,
		proficiencies,
		spellcasting,
		classInfo
	});

	const finalMockReducer = reduceReducers<EditingCharacterState>(
		mockEditingCharacterSlice.reducer,
		wholeMockReducer
	);

	return configureStore({
		reducer: {
			editingCharacter: finalMockReducer as Reducer<
				Partial<EditingCharacterState> | undefined
			>
		}
	});
};

const MockStore = ({
	overrideValues,
	children
}: {
	overrideValues?: Partial<AbilityScoresState>;
	children: ReactNode;
}) => (
	<Provider store={getMockStore(overrideValues ? overrideValues : {})}>
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
