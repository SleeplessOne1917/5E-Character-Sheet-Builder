import { ComponentMeta, ComponentStory } from '@storybook/react';
import ModalBackground from './ModalBackground';

export default {
	title: 'Components/ModalBackground',
	component: ModalBackground,
	args: {
		show: true,
		testId: 'modal-background'
	}
} as ComponentMeta<typeof ModalBackground>;

const Template: ComponentStory<typeof ModalBackground> = args => (
	<ModalBackground {...args}>
		<div style={{ width: '80%', height: '80%', backgroundColor: 'red' }} />
	</ModalBackground>
);

export const Default = Template.bind({});
