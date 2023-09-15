import * as stories from './TextInput.stories';

import { render, screen } from '@testing-library/react';

import TextInput from './TextInput';
import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';

const renderTestCases = Object.values(composeStories(stories));

it.each(renderTestCases)('renders correctly', Story => {
	render(<Story />);

	expect(screen.getByTestId('text-input')).toMatchSnapshot();
});

it('calls onChange when expected', async () => {
	const onChangeMock = jest.fn();
	render(
		<TextInput
			id="id"
			label="Label"
			onBlur={() => {}}
			onChange={onChangeMock}
			value=""
		/>
	);

	await userEvent.type(screen.getByLabelText(/Label/i), 'abcde');

	expect(onChangeMock).toHaveBeenCalled();
});

it('calls onBlur when expected', async () => {
	const onBlurMock = jest.fn();
	render(
		<TextInput
			id="id"
			label="Label"
			onBlur={onBlurMock}
			onChange={() => {}}
			value=""
		/>
	);

	await userEvent.type(screen.getByLabelText(/Label/i), 'abcde');
	await userEvent.tab();

	expect(onBlurMock).toHaveBeenCalled();
});
