import * as stories from './Checkbox.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { Checked, Default, Alternate } = composeStories(stories);

describe('renders correctly', () => {
	it('by default', () => {
		render(<Default />);

		expect(screen.getByRole('checkbox')).toMatchSnapshot();
	});

	it('when checked', () => {
		render(<Checked />);

		expect(screen.getByRole('checkbox')).toMatchSnapshot();
	});

	it('when alternate', () => {
		render(<Alternate />);

		expect(screen.getByRole('checkbox')).toMatchSnapshot();
	});
});
