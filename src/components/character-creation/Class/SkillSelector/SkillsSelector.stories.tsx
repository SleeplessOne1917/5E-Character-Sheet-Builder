import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../redux/store';
import SkillsSelector from './SkillsSelector';

export default {
	title: 'Components/SkillSelector',
	component: SkillsSelector,
	args: {
		skills: [
			{
				index: 'athletics',
				name: 'Athletics',
				type: 'SKILLS'
			},
			{
				index: 'investigation',
				name: 'Investigation',
				type: 'SKILLS'
			},
			{
				index: 'survival',
				name: 'Survival',
				type: 'SKILLS'
			}
		],
		value: 'athletics'
	},
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof SkillsSelector>;

const Template: ComponentStory<typeof SkillsSelector> = args => (
	<SkillsSelector {...args} />
);

export const Default = Template.bind({});
