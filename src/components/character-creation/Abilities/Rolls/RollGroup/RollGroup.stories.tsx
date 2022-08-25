import { ComponentMeta, ComponentStory } from '@storybook/react';
import RollGroup, { RollGroupProps } from './RollGroup';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { RollGroupsState } from '../../../../../redux/features/rollGroups';
import { mockAbilities } from '../../MockAbilitiesStore';
import { getTestStore } from '../../../../../redux/store';
import AbilityScores from '../../../../../types/abilityScores';

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

const mockState = {
	0: [{}, {}, {}, {}, {}, {}],
	1: [
		{ rolls: [4, 4, 1, 1] },
		{ rolls: [6, 5, 2, 1] },
		{ rolls: [3, 3, 3, 2] },
		{},
		{},
		{}
	],
	2: [
		{ rolls: [5, 4, 3, 2] },
		{ rolls: [6, 6, 6, 4] },
		{ rolls: [4, 2, 2, 1] },
		{ rolls: [5, 4, 4, 3] },
		{ rolls: [5, 5, 3, 1] },
		{ rolls: [4, 3, 3, 2] }
	],
	3: [
		{ rolls: [5, 4, 3, 2] },
		{ rolls: [6, 6, 6, 4] },
		{ rolls: [4, 2, 2, 1] },
		{ rolls: [5, 4, 4, 3], ability: 'int' },
		{ rolls: [5, 5, 3, 1], ability: 'dex' },
		{ rolls: [4, 3, 3, 2], ability: 'con' }
	],
	4: [
		{ rolls: [5, 4, 3, 2], ability: 'wis' },
		{ rolls: [6, 6, 6, 4], ability: 'str' },
		{ rolls: [4, 2, 2, 1], ability: 'cha' },
		{ rolls: [5, 4, 4, 3], ability: 'int' },
		{ rolls: [5, 5, 3, 1], ability: 'dex' },
		{ rolls: [4, 3, 3, 2], ability: 'con' }
	]
} as RollGroupsState;

const MockStore = ({ children }: { children: ReactNode }) => (
	<Provider
		store={getTestStore({
			rollGroups: createSlice({
				name: 'rollGroups',
				initialState: mockState,
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
			}).reducer
		})}
	>
		{children}
	</Provider>
);

export default {
	title: 'Components/RollGroup',
	component: RollGroup,
	args: {
		abilities: mockAbilities
	},
	argTypes: {
		onDeleteGroup: { type: 'function' }
	},
	decorators: [story => <MockStore>{story()}</MockStore>]
} as ComponentMeta<typeof RollGroup>;

const Template: ComponentStory<typeof RollGroup> = (args: RollGroupProps) => (
	<RollGroup {...args} />
);

export const Default = Template.bind({});
Default.args = {
	group: 0
};

export const HalfHaveRolls = Template.bind({});
HalfHaveRolls.args = {
	group: 1
};

export const AllHaveRolls = Template.bind({});
AllHaveRolls.args = {
	group: 2
};

export const HalfHaveAbilities = Template.bind({});
HalfHaveAbilities.args = {
	group: 3
};

export const AllHaveAbilities = Template.bind({});
AllHaveAbilities.args = {
	group: 4
};
