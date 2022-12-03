import { ComponentMeta, ComponentStory } from '@storybook/react';

import MyStuffIndex from './MyStuffIndex';

export default {
	title: 'Views/MyStuff/Index',
	component: MyStuffIndex
} as ComponentMeta<typeof MyStuffIndex>;

const Template: ComponentStory<typeof MyStuffIndex> = () => <MyStuffIndex />;

export const Default = Template.bind({});
