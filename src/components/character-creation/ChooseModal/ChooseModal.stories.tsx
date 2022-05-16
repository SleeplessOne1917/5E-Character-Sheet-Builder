import ChooseModal, { ChooseModalProps } from './ChooseModal';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
	title: 'Components/ChooseModal',
	component: ChooseModal,
	args: { mainContent: 'Content', show: true },
	argTypes: {
		onChoose: { type: 'function' },
		onClose: { type: 'function' }
	}
} as ComponentMeta<typeof ChooseModal>;

export const Default: ComponentStory<typeof ChooseModal> = (
	args: ChooseModalProps
) => <ChooseModal {...args} />;
