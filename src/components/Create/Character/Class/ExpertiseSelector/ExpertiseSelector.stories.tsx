import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../../redux/store';
import ExpertiseSelector from './ExpertiseSelector';

export default {
	title: 'Components/Create/Character/Class/ExpertiseSelector',
	component: ExpertiseSelector,
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof ExpertiseSelector>;

const Template: ComponentStory<typeof ExpertiseSelector> = () => (
	<ExpertiseSelector />
);

export const Default = Template.bind({});
