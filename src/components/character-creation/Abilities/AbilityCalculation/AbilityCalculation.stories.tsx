import AbilityCalculation, {
	AbilityCalculationProps
} from './AbilityCalculation';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MockStore from '../MockAbilitiesStore';

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
