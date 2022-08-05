import { SrdItem, SrdProficiencyItem } from '../../types/srd';
import abilityScores, {
	AbilityScoresState,
	initialState as abilityScoresInitialState
} from './abilityScores';
import { combineReducers, createSlice } from '@reduxjs/toolkit';
import languages, { initialState as languagesInitialState } from './languages';
import proficiencies, {
	initialState as proficienciesInitialState
} from './proficiencies';
import raceInfo, {
	RaceInfoState,
	initialState as raceInitialState
} from './raceInfo';

import reduceReducers from 'reduce-reducers';

export type EditingCharacterState = {
	abilityScores: AbilityScoresState;
	raceInfo: RaceInfoState;
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
};

const initialState: EditingCharacterState = {
	abilityScores: abilityScoresInitialState,
	raceInfo: raceInitialState,
	languages: languagesInitialState,
	proficiencies: proficienciesInitialState
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
	proficiencies
});

export default reduceReducers<EditingCharacterState>(
	editingCharacterSlice.reducer,
	wholeReducer
);
