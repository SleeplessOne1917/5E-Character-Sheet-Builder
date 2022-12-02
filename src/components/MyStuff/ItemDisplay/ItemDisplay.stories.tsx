import { ComponentMeta, ComponentStory } from '@storybook/react';

import ItemDisplay from './ItemDisplay';

export default {
	title: 'Components/MyStuff/Item',
	component: ItemDisplay,
	args: {
		item: { id: 'foo', name: 'Foo' }
	}
} as ComponentMeta<typeof ItemDisplay>;

const Template: ComponentStory<typeof ItemDisplay> = args => (
	<ItemDisplay {...args} />
);

export const Default = Template.bind({});
