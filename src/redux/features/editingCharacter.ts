import abilityScores, {
	AbilityScoresState,
	initialState as abilityScoresInitialState
} from './abilityScores';
import { combineReducers, createSlice } from '@reduxjs/toolkit';
import languages, { initialState as languagesInitialState } from './languages';
import raceInfo, {
	RaceInfoState,
	initialState as raceInitialState
} from './raceInfo';

import { SrdItem } from '../../types/srd';
import reduceReducers from 'reduce-reducers';

export type EditingCharacterState = {
	abilityScores: AbilityScoresState;
	raceInfo: RaceInfoState;
	languages: SrdItem[];
};

const initialState: EditingCharacterState = {
	abilityScores: abilityScoresInitialState,
	raceInfo: raceInitialState,
	languages: languagesInitialState
};

const editingCharacterSlice = createSlice({
	name: 'editingCharacter',
	initialState,
	reducers: {}
});

const wholeReducer = combineReducers({
	abilityScores,
	raceInfo,
	languages
});

export default reduceReducers<EditingCharacterState>(
	editingCharacterSlice.reducer,
	wholeReducer
);
