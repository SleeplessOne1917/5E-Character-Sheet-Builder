import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import AbilityScores from '../../types/abilityScores';

type RollGroupsState = {
	[key: number]: Roll[];
};

type Roll = {
	rolls?: number[] | null;
	ability?: AbilityScores | null;
};

const initialState: RollGroupsState = {
	1: [{}, {}, {}, {}, {}, {}]
};

type AddRollsPayload = {
	rolls: number[] | null;
	group: number;
	index: number;
};

type AddAbilityPayload = {
	ability: AbilityScores | null;
	group: number;
	index: number;
};

type GroupPayload = {
	group: number;
};

const rollGroupsSlice = createSlice({
	name: 'rollGroups',
	initialState,
	reducers: {
		addGroup: state => {
			const newGroup =
				parseInt(Object.keys(state)[Object.keys(state).length - 1]) + 1;
			state[newGroup] = [{}, {}, {}, {}, {}, {}];
		},
		removeGroup: (state, action: PayloadAction<GroupPayload>) => {
			delete state[action.payload.group];
		},
		addRolls: (state, action: PayloadAction<AddRollsPayload>) => {
			const { rolls, group, index } = action.payload;

			state[group][index].rolls = rolls;
		},
		addAbility: (state, action: PayloadAction<AddAbilityPayload>) => {
			const { ability, group, index } = action.payload;

			state[group][index].ability = ability;
		}
	}
});

export const { addRolls, addAbility, addGroup, removeGroup } =
	rollGroupsSlice.actions;

export default rollGroupsSlice.reducer;
