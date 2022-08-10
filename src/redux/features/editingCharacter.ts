import { SrdItem, SrdProficiencyItem, SrdSpellItem } from '../../types/srd';
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
import proficiencies, {
	initialState as proficienciesInitialState
} from './proficiencies';
import raceInfo, {
	RaceInfoState,
	initialState as raceInitialState
} from './raceInfo';
import spells, { initialState as spellsInitialState } from './spells';

import reduceReducers from 'reduce-reducers';

export type EditingCharacterState = {
	abilityScores: AbilityScoresState;
	raceInfo: RaceInfoState;
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
	spells: SrdSpellItem[];
	classInfo: ClassInfoState;
};

const initialState: EditingCharacterState = {
	abilityScores: abilityScoresInitialState,
	raceInfo: raceInitialState,
	languages: languagesInitialState,
	proficiencies: proficienciesInitialState,
	spells: spellsInitialState,
	classInfo: classInitialState
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
	spells,
	classInfo
});

export default reduceReducers<EditingCharacterState>(
	editingCharacterSlice.reducer,
	wholeReducer
);
