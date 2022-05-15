import { ComponentMeta, ComponentStory } from '@storybook/react';
import ManualScores, { ManualScoresProps } from './ManualScores';
import MockStore, { mockAbilities } from '../MockAbilitiesStore';

const ManualScoresSb = {
	title: 'Components/ManualScores',
	component: ManualScores,
	args: {
		abilities: mockAbilities
	}
} as ComponentMeta<typeof ManualScores>;

export default ManualScoresSb;

export const Default: ComponentStory<typeof ManualScores> = (
	args: ManualScoresProps
) => <ManualScores {...args} />;
Default.decorators = [story => <MockStore index="dex">{story()}</MockStore>];
