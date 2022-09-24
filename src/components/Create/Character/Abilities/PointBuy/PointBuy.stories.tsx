import { ComponentMeta, ComponentStory } from '@storybook/react';
import MockStore, { mockAbilities } from '../MockAbilitiesStore';
import PointBuy, { PointBuyProps } from './PointBuy';

import { AbilityScoresState } from '../../../../../redux/features/abilityScores';

const defaultState: AbilityScoresState = {
	cha: { base: 8, highest: 20, abilityImprovement: 0 },
	con: { base: 8, highest: 20, abilityImprovement: 0 },
	dex: { base: 8, highest: 20, abilityImprovement: 0 },
	int: { base: 8, highest: 20, abilityImprovement: 0 },
	str: { base: 8, highest: 20, abilityImprovement: 0 },
	wis: { base: 8, highest: 20, abilityImprovement: 0 }
};

export default {
	title: 'Components/Create/Character/Abilities/PointBuy',
	component: PointBuy,
	args: {
		abilities: mockAbilities
	}
} as ComponentMeta<typeof PointBuy>;

const Template: ComponentStory<typeof PointBuy> = (args: PointBuyProps) => (
	<PointBuy {...args} />
);

export const Default = Template.bind({});
Default.decorators = [
	story => <MockStore overrideValues={defaultState}>{story()}</MockStore>
];

export const NoMorePoints = Template.bind({});
NoMorePoints.decorators = [
	story => (
		<MockStore
			overrideValues={{
				con: { base: 12, highest: 20, abilityImprovement: 0 },
				cha: { base: 13, highest: 20, abilityImprovement: 0 },
				dex: { base: 14, highest: 20, abilityImprovement: 0 },
				int: { base: 12, highest: 20, abilityImprovement: 0 },
				str: { base: 12, highest: 20, abilityImprovement: 0 },
				wis: { base: 11, highest: 20, abilityImprovement: 0 }
			}}
		>
			{story()}
		</MockStore>
	)
];

export const SomePointsSpent = Template.bind({});
SomePointsSpent.decorators = [
	story => (
		<MockStore
			overrideValues={{
				...defaultState,
				str: { base: 12, highest: 20, abilityImprovement: 0 },
				wis: { base: 14, highest: 20, abilityImprovement: 0 }
			}}
		>
			{story()}
		</MockStore>
	)
];
