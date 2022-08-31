import { SrdItem, SrdProficiencyItem } from '../../types/srd';
import abilityScores, {
	AbilityScoresState,
	initialState as abilityScoresInitialState
} from './abilityScores';
import classInfo, {
	ClassInfoState,
	initialState as classInitialState
} from './classInfo';
import { combineReducers, createSlice } from '@reduxjs/toolkit';
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
import hp, { HPState, initialState as hpInitialState } from './hp';

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
	hp
});

export default reduceReducers<EditingCharacterState>(
	editingCharacterSlice.reducer,
	wholeReducer
);
