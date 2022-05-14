import AbilityCalculation, {
	AbilityCalculationProps
} from './AbilityCalculation';
import {
	AbilityScore,
	AbilityScoresState
} from '../../../../redux/features/abilityScores';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { configureStore, createSlice } from '@reduxjs/toolkit';

import AbilityScores from '../../../../types/abilityScores';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';

const defaultInitialState: { abilityScores: AbilityScoresState } = {
	abilityScores: {
		str: {
			base: 12
		},
		dex: {
			base: 8,
			abilityImprovement: 4
		},
		cha: { base: 15, raceBonus: 2 },
		con: { override: 10 },
		int: { otherBonus: 5 },
		wis: { base: 14, override: 25 }
	}
};

const getMockStore = (index: AbilityScores, overrideValues: AbilityScore) => {
	const initialState = {
		abilityScores: {
			...defaultInitialState.abilityScores,
			[index]: {
				...defaultInitialState.abilityScores[index],
				...overrideValues
			}
		}
	};

	const mockEditingCharacterSlice = createSlice({
		name: 'editingCharacter',
		initialState: initialState,
		reducers: {}
	});

	return configureStore({
		reducer: { editingCharacter: mockEditingCharacterSlice.reducer }
	});
};

const MockStore = ({
	overrideValues = {},
	index,
	children
}: {
	overrideValues?: AbilityScore;
	index: AbilityScores;
	children: ReactNode;
}) => (
	<Provider store={getMockStore(index, overrideValues)}>{children}</Provider>
);

const AbilityCalculationSb = {
	title: 'Components/AbilityCalculation',
	component: AbilityCalculation
} as ComponentMeta<typeof AbilityCalculation>;

export default AbilityCalculationSb;

const Template: ComponentStory<typeof AbilityCalculation> = (
	args: AbilityCalculationProps
) => <AbilityCalculation {...args} />;

export const OnlyBaseScore = Template.bind({});
OnlyBaseScore.args = {
	index: 'str',
	name: 'Strength'
};
OnlyBaseScore.decorators = [
	story => <MockStore index="str">{story()}</MockStore>
];

export const ScoreWithAbilityImprovement = Template.bind({});
ScoreWithAbilityImprovement.args = {
	index: 'dex',
	name: 'Dexterity'
};
ScoreWithAbilityImprovement.decorators = [
	story => <MockStore index="dex">{story()}</MockStore>
];

export const ScoreWithRaceBonus = Template.bind({});
ScoreWithRaceBonus.args = { index: 'cha', name: 'Charisma' };
ScoreWithRaceBonus.decorators = [
	story => <MockStore index="cha">{story()}</MockStore>
];

export const OverrideWithNoBase = Template.bind({});
OverrideWithNoBase.args = {
	index: 'con',
	name: 'Constitution'
};
OverrideWithNoBase.decorators = [
	story => <MockStore index="con">{story()}</MockStore>
];

export const MiscBonusWithBase = Template.bind({});
MiscBonusWithBase.args = {
	index: 'wis',
	name: 'Wisdom'
};
MiscBonusWithBase.decorators = [
	story => (
		<MockStore index="wis" overrideValues={{ base: 13, miscBonus: 1 }}>
			{story()}
		</MockStore>
	)
];

export const OtherBonusWithNoBase = Template.bind({});
OtherBonusWithNoBase.args = {
	index: 'int',
	name: 'Intelligence'
};
OtherBonusWithNoBase.decorators = [
	story => <MockStore index="int">{story()}</MockStore>
];

export const BaseWithOverride = Template.bind({});
BaseWithOverride.args = {
	index: 'wis',
	name: 'Wisdom'
};
BaseWithOverride.decorators = [
	story => <MockStore index="wis">{story()}</MockStore>
];

export const AllBonusesAndOverrideButNoBase = Template.bind({});
AllBonusesAndOverrideButNoBase.args = {
	index: 'dex',
	name: 'Dexterity'
};
AllBonusesAndOverrideButNoBase.decorators = [
	story => (
		<MockStore
			index="dex"
			overrideValues={{
				base: null,
				abilityImprovement: 4,
				raceBonus: 2,
				otherBonus: 1,
				override: 28,
				miscBonus: 1
			}}
		>
			{story()}
		</MockStore>
	)
];

export const Everything = Template.bind({});
Everything.args = {
	index: 'str',
	name: 'Strength'
};
Everything.decorators = [
	story => (
		<MockStore
			index="str"
			overrideValues={{
				base: 15,
				abilityImprovement: 2,
				miscBonus: 3,
				raceBonus: 1,
				otherBonus: 1,
				override: 5
			}}
		>
			{story()}
		</MockStore>
	)
];
