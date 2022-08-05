import { ComponentMeta, ComponentStory } from '@storybook/react';
import ConfirmationModal from './ConfirmationModal';

export default {
	title: 'Components/ConfirmationModal',
	component: ConfirmationModal,
	args: {
		show: true,
		message: 'Are you sure you want to do that?'
	}
} as ComponentMeta<typeof ConfirmationModal>;

const Template: ComponentStory<typeof ConfirmationModal> = args => (
	<ConfirmationModal {...args} />
);

export const Default = Template.bind({});
