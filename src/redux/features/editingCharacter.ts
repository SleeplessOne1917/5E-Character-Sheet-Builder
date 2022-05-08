import abilityScores, {
	AbilityScoresState,
	initialState as abilityScoresInitialState
} from './abilityScores';
import { combineReducers, createSlice } from '@reduxjs/toolkit';

import reduceReducers from 'reduce-reducers';

export type EditingCharacterState = {
	abilityScores: AbilityScoresState;
};

const initialState: EditingCharacterState = {
	abilityScores: abilityScoresInitialState
};

const editingCharacterSlice = createSlice({
	name: 'editingCharacter',
	initialState,
	reducers: {}
});

const wholeReducer = combineReducers({
	abilityScores
});

export default reduceReducers<EditingCharacterState>(
	editingCharacterSlice.reducer,
	wholeReducer
);
