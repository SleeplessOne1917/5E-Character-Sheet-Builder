import { ComponentMeta, ComponentStory } from '@storybook/react';
import MockStore, { mockAbilities } from '../MockAbilitiesStore';
import PointBuy, { PointBuyProps } from './PointBuy';

import { AbilityScoresState } from '../../../../redux/features/abilityScores';

const defaultState: AbilityScoresState = {
	cha: { base: 8 },
	con: { base: 8 },
	dex: { base: 8 },
	int: { base: 8 },
	str: { base: 8 },
	wis: { base: 8 }
};

export default {
	title: 'Components/PointBuy',
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
				con: { base: 12 },
				cha: { base: 13 },
				dex: { base: 14 },
				int: { base: 12 },
				str: { base: 12 },
				wis: { base: 11 }
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
			overrideValues={{ ...defaultState, str: { base: 12 }, wis: { base: 14 } }}
		>
			{story()}
		</MockStore>
	)
];
