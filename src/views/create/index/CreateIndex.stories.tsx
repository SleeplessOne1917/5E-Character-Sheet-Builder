import { ComponentMeta, ComponentStory } from '@storybook/react';

import CreateIndex from './CreateIndex';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../redux/store';

export default {
	title: 'Views/Create/Index',
	component: CreateIndex,
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof CreateIndex>;

const Template: ComponentStory<typeof CreateIndex> = () => <CreateIndex />;

export const Default = Template.bind({});
