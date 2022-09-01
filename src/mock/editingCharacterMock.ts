import { AppReducers } from './../types/redux';
import abilityScores, {
	initialState as abilityScoresInitialState,
	reducers as abilityScoresReducers
} from '../redux/features/abilityScores';
import classInfo, {
	initialState as classInitialState,
	reducers as classReducers
} from '../redux/features/classInfo';
import {
	AnyAction,
	combineReducers,
	createSlice,
	Reducer
} from '@reduxjs/toolkit';
import languages, {
	initialState as languagesInitialState,
	reducers as languagesReducers
} from '../redux/features/languages';
import name, {
	initialState as nameInitialState,
	reducers as nameReducers
} from '../redux/features/name';
import proficiencies, {
	initialState as proficienciesInitialState,
	reducers as proficienciesReducers
} from '../redux/features/proficiencies';
import raceInfo, {
	initialState as raceInitialState,
	reducers as raceReducers
} from '../redux/features/raceInfo';
import spellcasting, {
	initialState as spellcastingInitialState,
	reducers as spellcastingRedcuers
} from '../redux/features/spellcasting';
import hp, {
	initialState as hpInitialState,
	reducers as hpReducers
} from '../redux/features/hp';
import { EditingCharacterState } from '../redux/features/editingCharacter';
import reduceReducers from 'reduce-reducers';
import { merge, cloneDeep } from 'lodash';
import { DeepPartial } from '../types/helpers';

const mapReducersAndInitialState = (
	key: keyof EditingCharacterState
): { reducers: AppReducers<any>; initialState: any } => {
	switch (key) {
		case 'abilityScores':
			return {
				reducers: abilityScoresReducers,
				initialState: abilityScoresInitialState
			};
		case 'classInfo':
			return { reducers: classReducers, initialState: classInitialState };
		case 'hp':
			return { reducers: hpReducers, initialState: hpInitialState };
		case 'languages':
			return {
				reducers: languagesReducers,
				initialState: languagesInitialState
			};
		case 'name':
			return { reducers: nameReducers, initialState: nameInitialState };
		case 'proficiencies':
			return {
				reducers: proficienciesReducers,
				initialState: proficienciesInitialState
			};
		case 'raceInfo':
			return { reducers: raceReducers, initialState: raceInitialState };
		case 'spellcasting':
			return {
				reducers: spellcastingRedcuers,
				initialState: spellcastingInitialState
			};
	}
};

const getReducer = (key: keyof EditingCharacterState, override: any) => {
	const { reducers, initialState } = mapReducersAndInitialState(key);

	return createSlice({
		name: key,
		initialState: merge(cloneDeep(initialState), override),
		reducers
	}).reducer;
};

const getMockEditingCharacter = (
	overrides: DeepPartial<EditingCharacterState>
) => {
	const combineReducersOverrides = Object.keys(overrides).reduce<{
		[key: string]: ReturnType<typeof getReducer>;
	}>((acc, cur) => {
		acc[cur] = getReducer(
			cur as keyof EditingCharacterState,
			(overrides as { [key: string]: any })[cur]
		);

		return acc;
	}, {});

	const initialState: EditingCharacterState = merge(
		cloneDeep({
			abilityScores: abilityScoresInitialState,
			raceInfo: raceInitialState,
			languages: languagesInitialState,
			proficiencies: proficienciesInitialState,
			spellcasting: spellcastingInitialState,
			classInfo: classInitialState,
			name: nameInitialState,
			hp: hpInitialState
		}),
		overrides
	);

	const editingCharacterSlice = createSlice({
		name: 'editingCharacter',
		initialState,
		reducers: {}
	});

	const wholeReducer = combineReducers({
		abilityScores,
		raceInfo,
		languages,
		proficiencies,
		spellcasting,
		classInfo,
		name,
		hp,
		...combineReducersOverrides
	});

	return reduceReducers<EditingCharacterState>(
		editingCharacterSlice.reducer,
		wholeReducer
	) as Reducer<EditingCharacterState, AnyAction>;
};

export default getMockEditingCharacter;
