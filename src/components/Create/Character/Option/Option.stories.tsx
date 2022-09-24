import { ComponentMeta, ComponentStory } from '@storybook/react';
import Option from './Option';

export default {
	title: 'Components/CharacterCreation/Option',
	component: Option,
	argTypes: {
		onChoose: { type: 'function' }
	},
	args: {
		iconId: 'dwarf'
	},
	decorators: [story => <ul style={{ listStyle: 'none' }}>{story()}</ul>]
} as ComponentMeta<typeof Option>;

const Template: ComponentStory<typeof Option> = args => <Option {...args} />;

export const OnlyOption = Template.bind({});
OnlyOption.args = {
	option: {
		index: 'dwarf',
		name: 'Dwarf'
	}
};

export const OptionWithOneSubOption = Template.bind({});
OptionWithOneSubOption.args = {
	option: {
		index: 'dwarf',
		name: 'Dwarf'
	},
	subOptions: [
		{
			index: 'hill-dwarf',
			name: 'Hill Dwarf'
		}
	]
};

export const OptionWithMultipleSubOptions = Template.bind({});
OptionWithMultipleSubOptions.args = {
	option: {
		index: 'dwarf',
		name: 'Dwarf'
	},
	subOptions: [
		{
			index: 'hill-dwarf',
			name: 'Hill Dwarf'
		},
		{
			index: 'mountain-dwarf',
			name: 'Mountain Dwarf'
		}
	]
};
