import { ComponentMeta, ComponentStory } from '@storybook/react';

import ForgotPassword from './ForgotPassword';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../redux/store';

export default {
	title: 'Views/Forgot/Password',
	component: ForgotPassword,
	decorators: [story => <Provider store={getTestStore()}>{story()}</Provider>],
	args: {
		loading: false
	}
} as ComponentMeta<typeof ForgotPassword>;

const Template: ComponentStory<typeof ForgotPassword> = (args: any) => (
	<ForgotPassword {...args} />
);

export const Default = Template.bind({});
