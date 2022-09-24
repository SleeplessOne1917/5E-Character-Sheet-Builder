import { ComponentMeta, ComponentStory } from '@storybook/react';

import SectionBar from './SectionBar';

export default {
	title: 'Components/CharacterCreation/SectionBar',
	component: SectionBar,
	parameters: {
		nextRouter: {
			pathname: '/create/character/race',
			asPath: '/create/character/race'
		}
	}
} as ComponentMeta<typeof SectionBar>;

const Template: ComponentStory<typeof SectionBar> = args => (
	<SectionBar {...args} />
);

export const Default = Template.bind({});

export const WithSpells = Template.bind({});
WithSpells.args = {
	hasSpellcasting: true
};
