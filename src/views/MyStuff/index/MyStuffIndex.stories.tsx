import { ComponentMeta, ComponentStory } from '@storybook/react';

import MyStuffIndex from './MyStuffIndex';

export default {
	title: 'Views/MyStuff/Index',
	component: MyStuffIndex,
	args: {
		loading: false
	}
} as ComponentMeta<typeof MyStuffIndex>;

const Template: ComponentStory<typeof MyStuffIndex> = args => (
	<MyStuffIndex {...args} />
);

export const Default = Template.bind({});
