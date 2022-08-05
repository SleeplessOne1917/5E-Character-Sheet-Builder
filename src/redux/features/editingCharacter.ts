import abilityScores, {
	AbilityScoresState,
	initialState as abilityScoresInitialState
} from './abilityScores';
import raceInfo, {
	RaceInfoState,
	initialState as raceInitialState
} from './raceInfo';
import { combineReducers, createSlice } from '@reduxjs/toolkit';

import reduceReducers from 'reduce-reducers';

export type EditingCharacterState = {
	abilityScores: AbilityScoresState;
	raceInfo: RaceInfoState;
};

const initialState: EditingCharacterState = {
	abilityScores: abilityScoresInitialState,
	raceInfo: raceInitialState
};

const editingCharacterSlice = createSlice({
	name: 'editingCharacter',
	initialState,
	reducers: {}
});

const wholeReducer = combineReducers({
	abilityScores,
	raceInfo
});

export default reduceReducers<EditingCharacterState>(
	editingCharacterSlice.reducer,
	wholeReducer
);
