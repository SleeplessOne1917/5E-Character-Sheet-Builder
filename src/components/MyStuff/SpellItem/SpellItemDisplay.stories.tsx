import { ComponentMeta, ComponentStory } from '@storybook/react';

import SpellItemDisplay from './SpellItemDisplay';

export default {
	title: 'Components/MyStuff/SpellItem',
	component: SpellItemDisplay,
	args: {
		spell: {
			id: 'ray-of-frost',
			name: 'Ray of Frost',
			level: 0,
			school: {
				name: 'Evocation',
				id: 'evocation'
			}
		}
	}
} as ComponentMeta<typeof SpellItemDisplay>;

const Template: ComponentStory<typeof SpellItemDisplay> = args => (
	<SpellItemDisplay {...args} />
);

export const Default = Template.bind({});
