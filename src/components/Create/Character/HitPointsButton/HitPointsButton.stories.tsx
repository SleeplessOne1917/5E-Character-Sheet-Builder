import { ComponentMeta, ComponentStory } from '@storybook/react';

import HitPointsButton from './HitPointsButton';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../redux/store';

export default {
	title: 'Components/Create/Character/HitPointsButton',
	component: HitPointsButton,
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof HitPointsButton>;

const Template: ComponentStory<typeof HitPointsButton> = () => (
	<HitPointsButton />
);

export const Default = Template.bind({});
