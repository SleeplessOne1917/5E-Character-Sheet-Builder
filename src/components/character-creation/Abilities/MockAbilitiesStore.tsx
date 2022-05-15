import {
	AbilityPayload,
	AbilityScore,
	AbilityScoresState
} from '../../../redux/features/abilityScores';
import {
	PayloadAction,
	Reducer,
	combineReducers,
	configureStore,
	createSlice
} from '@reduxjs/toolkit';

import AbilityScores from '../../../types/abilityScores';
import { EditingCharacterState } from '../../../redux/features/editingCharacter';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import reduceReducers from 'reduce-reducers';

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

const getMockStore = (overrideValues: Partial<AbilityScoresState>) => {
	const initialState = {
		abilityScores: {
			...defaultInitialState.abilityScores,
			...overrideValues
		}
	} as Partial<EditingCharacterState>;

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
		initialState: initialState,
		reducers: {}
	});

	const wholeMockReducer = combineReducers({
		abilityScores: mockAbilityScoreSlice.reducer
	}) as Reducer<Partial<EditingCharacterState>>;

	const finalMockReducer = reduceReducers<Partial<EditingCharacterState>>(
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

export const mockAbilities = [
	{ index: 'str', full_name: 'Strength' },
	{ index: 'dex', full_name: 'Dexterity' },
	{ index: 'con', full_name: 'Constitution' },
	{ index: 'int', full_name: 'Intelligence' },
	{ index: 'wis', full_name: 'Wisdom' },
	{ index: 'cha', full_name: 'Charisma' }
];
