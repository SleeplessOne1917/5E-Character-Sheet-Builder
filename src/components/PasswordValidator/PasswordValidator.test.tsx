import '@testing-library/jest-dom';

import * as stories from './PasswordValidator.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/react';

const testCases = Object.values(composeStories(stories));

it.each(testCases)('renders correctly', Story => {
	render(<Story />).container;

	expect(screen.getByTestId('container')).toMatchSnapshot();
});
