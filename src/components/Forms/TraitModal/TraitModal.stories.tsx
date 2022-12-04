import { ComponentMeta, ComponentStory } from '@storybook/react';

import TraitModal from './TraitModal';

export default {
	title: 'Components/Forms/TraitModal',
	component: TraitModal,
	args: {
		show: true,
		trait: {
			name: 'Foo the Bar',
			description:
				'Your natrual fooness gives you advantage on saving throws against bar.'
		}
	}
} as ComponentMeta<typeof TraitModal>;

const Template: ComponentStory<typeof TraitModal> = args => (
	<TraitModal {...args} />
);

export const Include = Template.bind({});
Include.args = {
	mode: 'include'
};

export const Omit = Template.bind({});
Omit.args = {
	mode: 'omit'
};
