import { render, screen } from '@testing-library/react';
import * as stories from './Checkbox.stories';
import { composeStories } from '@storybook/testing-react';

const { Checked, Default } = composeStories(stories);

describe('renders correctly', () => {
	it('by default', () => {
		render(<Default />);

		expect(screen.getByRole('checkbox')).toMatchSnapshot();
	});

	it('when checked', () => {
		render(<Checked />);

		expect(screen.getByRole('checkbox')).toMatchSnapshot();
	});
});
