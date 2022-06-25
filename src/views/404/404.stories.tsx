import { ComponentMeta, ComponentStory } from '@storybook/react';

import Four04 from './404';

export default {
	title: 'Views/404',
	component: Four04
} as ComponentMeta<typeof Four04>;

const Template: ComponentStory<typeof Four04> = () => <Four04 />;

export const Default = Template.bind({});
