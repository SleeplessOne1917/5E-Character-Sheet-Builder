import { ComponentMeta, ComponentStory } from '@storybook/react';
import LandSelector from './LandSelector';

export default {
	title: 'Components/Create/Character/Class/LandSelector',
	component: LandSelector,
	args: {
		value: 'coast'
	}
} as ComponentMeta<typeof LandSelector>;

const Template: ComponentStory<typeof LandSelector> = args => (
	<LandSelector {...args} />
);

export const Default = Template.bind({});
