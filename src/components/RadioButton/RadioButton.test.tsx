import * as stories from './RadioButton.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { Checked, Default } = composeStories(stories);

describe('renders correctly', () => {
	it('when unchecked', () => {
		render(<Default />);

		expect(screen.getByTestId('radio-button')).toMatchSnapshot();
	});

	it('when checked', () => {
		render(<Checked />);

		expect(screen.getByTestId('radio-button')).toMatchSnapshot();
	});
});
