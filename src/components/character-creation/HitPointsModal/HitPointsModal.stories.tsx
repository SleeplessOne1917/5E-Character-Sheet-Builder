import { ComponentMeta, ComponentStory } from '@storybook/react';
import HitPointsModal from './HitPointsModal';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../redux/store';

export default {
	title: 'Components/HitPointsModal',
	component: HitPointsModal,
	args: {
		show: true
	},
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof HitPointsModal>;

const Template: ComponentStory<typeof HitPointsModal> = args => (
	<HitPointsModal {...args} />
);

export const Default = Template.bind({});
