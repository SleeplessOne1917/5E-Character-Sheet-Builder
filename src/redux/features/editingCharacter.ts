import {
	AnyAction,
	Reducer,
	combineReducers,
	createSlice
} from '@reduxjs/toolkit';
import { SrdItem, SrdProficiencyItem } from '../../types/srd';
import abilityScores, {
	AbilityScoresState,
	initialState as abilityScoresInitialState
} from './abilityScores';
import classInfo, {
	ClassInfoState,
	initialState as classInitialState
} from './classInfo';
import hp, { HPState, initialState as hpInitialState } from './hp';
import languages, { initialState as languagesInitialState } from './languages';
import name, { initialState as nameInitialState } from './name';
import proficiencies, {
	initialState as proficienciesInitialState
} from './proficiencies';
import raceInfo, {
	RaceInfoState,
	initialState as raceInitialState
} from './raceInfo';
import spellcasting, {
	SpellcastingState,
	initialState as spellcastingInitialState
} from './spellcasting';

import reduceReducers from 'reduce-reducers';

export type EditingCharacterState = {
	abilityScores: AbilityScoresState;
	raceInfo: RaceInfoState;
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
	spellcasting: SpellcastingState;
	classInfo: ClassInfoState;
	name: string;
	hp: HPState;
};

type OverrideReducersType = {
	abilityScores?: Reducer<AbilityScoresState, AnyAction>;
	raceInfo?: Reducer<RaceInfoState, AnyAction>;
	languages?: Reducer<SrdItem[], AnyAction>;
	proficiencies?: Reducer<SrdProficiencyItem[], AnyAction>;
	spellcasting?: Reducer<SpellcastingState, AnyAction>;
	classInfo?: Reducer<ClassInfoState, AnyAction>;
	name?: Reducer<string, AnyAction>;
	hp?: Reducer<HPState, AnyAction>;
};

export const initialState: EditingCharacterState = {
	abilityScores: abilityScoresInitialState,
	raceInfo: raceInitialState,
	languages: languagesInitialState,
	proficiencies: proficienciesInitialState,
	spellcasting: spellcastingInitialState,
	classInfo: classInitialState,
	name: nameInitialState,
	hp: hpInitialState
};

const editingCharacterSlice = createSlice({
	name: 'editingCharacter',
	initialState,
	reducers: {
		doNothing: state => state
	}
});

export const { doNothing } = editingCharacterSlice.actions;

export const createEditingCharacterReducer = (
	overrideReducers: OverrideReducersType = {}
) =>
	reduceReducers<EditingCharacterState>(
		editingCharacterSlice.reducer,
		combineReducers({
			abilityScores,
			raceInfo,
			languages,
			proficiencies,
			spellcasting,
			classInfo,
			name,
			hp,
			...overrideReducers
		})
	);

export default createEditingCharacterReducer();
