import { ComponentMeta, ComponentStory } from '@storybook/react';

import HitPointsButton from './HitPointsButton';

export default {
	title: 'Components/HitPointsButton',
	component: HitPointsButton
} as ComponentMeta<typeof HitPointsButton>;

const Template: ComponentStory<typeof HitPointsButton> = () => (
	<HitPointsButton />
);

export const Default = Template.bind({});
