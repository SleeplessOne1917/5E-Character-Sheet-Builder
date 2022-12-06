import { AnyAction, Reducer } from '@reduxjs/toolkit';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
	EditingCharacterState,
	createEditingCharacterReducer
} from '../../../../redux/features/editingCharacter';

import HitPointsModal from './HitPointsModal';
import { Provider } from 'react-redux';
import { createAbilityScoreSlice } from '../../../../redux/features/abilityScores';
import { createClassrInfoSlice } from '../../../../redux/features/classInfo';
import { createHPSlice } from '../../../../redux/features/hp';
import { getTestStore } from '../../../../redux/store';

export default {
	title: 'Components/Create/Character/HitPointsModal',
	component: HitPointsModal,
	args: {
		show: true
	},
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof HitPointsModal>;

const Template: ComponentStory<typeof HitPointsModal> = args => (
	<HitPointsModal {...args} />
);

export const NoClassSelected = Template.bind({});

export const ClassSelected = Template.bind({});
ClassSelected.decorators = [
	Story => (
		<Provider
			store={getTestStore({
				editingCharacter: createEditingCharacterReducer({
					hp: createHPSlice({
						levelHPBonuses: [1, 8, 6, 3, 5]
					}).reducer,
					abilityScores: createAbilityScoreSlice({
						con: {
							base: 14,
							raceBonus: 2
						}
					}).reducer,
					classInfo: createClassrInfoSlice({
						level: 6,
						class: {
							hit_die: 8
						}
					}).reducer
				}) as Reducer<EditingCharacterState, AnyAction>
			})}
		>
			<Story />
		</Provider>
	)
];
