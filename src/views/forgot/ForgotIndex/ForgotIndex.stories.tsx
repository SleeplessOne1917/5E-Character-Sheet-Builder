import { ComponentMeta, ComponentStory } from '@storybook/react';

import ForgotIndex from './ForgotIndex';

export default {
	title: 'Views/ForgotIndex',
	component: ForgotIndex
} as ComponentMeta<typeof ForgotIndex>;

const Template: ComponentStory<typeof ForgotIndex> = (args: any) => (
	<ForgotIndex {...args} />
);

export const Default = Template.bind({});
