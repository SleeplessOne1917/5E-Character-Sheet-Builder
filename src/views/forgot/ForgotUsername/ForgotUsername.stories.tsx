import { ComponentMeta, ComponentStory } from '@storybook/react';

import ForgotUsername from './ForgotUsername';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../redux/store';

export default {
	title: 'Views/ForgotUsername',
	component: ForgotUsername,
	decorators: [story => <Provider store={getTestStore()}>{story()}</Provider>],
	args: {
		loading: false
	}
} as ComponentMeta<typeof ForgotUsername>;

const Template: ComponentStory<typeof ForgotUsername> = (args: any) => (
	<ForgotUsername {...args} />
);

export const Default = Template.bind({});
