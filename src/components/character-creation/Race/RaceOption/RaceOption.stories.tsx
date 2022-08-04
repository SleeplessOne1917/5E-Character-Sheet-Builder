import { ComponentMeta, ComponentStory } from '@storybook/react';
import RaceOption, { RaceOptionProps } from './RaceOption';

export default {
	title: 'Components/RaceOption',
	component: RaceOption,
	argTypes: {
		onChoose: { type: 'function' }
	},
	args: {
		iconId: 'dwarf'
	},
	decorators: [story => <ul style={{ listStyle: 'none' }}>{story()}</ul>]
} as ComponentMeta<typeof RaceOption>;

const Template: ComponentStory<typeof RaceOption> = (args: RaceOptionProps) => (
	<RaceOption {...args} />
);

export const OnlyRace = Template.bind({});
OnlyRace.args = {
	race: {
		index: 'dwarf',
		name: 'Dwarf'
	}
};

export const RaceWithOneSubrace = Template.bind({});
RaceWithOneSubrace.args = {
	race: {
		index: 'dwarf',
		name: 'Dwarf'
	},
	subraces: [
		{
			index: 'hill-dwarf',
			name: 'Hill Dwarf',
			race: {
				index: 'dwarf'
			}
		}
	]
};

export const RaceWithMultipleSubraces = Template.bind({});
RaceWithMultipleSubraces.args = {
	race: {
		index: 'dwarf',
		name: 'Dwarf'
	},
	subraces: [
		{
			index: 'hill-dwarf',
			name: 'Hill Dwarf',
			race: {
				index: 'dwarf'
			}
		},
		{
			index: 'mountain-dwarf',
			name: 'Mountain Dwarf',
			race: {
				index: 'dwarf'
			}
		}
	]
};
