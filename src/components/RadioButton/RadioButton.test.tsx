import { render, screen } from '@testing-library/react';
import * as stories from './RadioButton.stories';
import { composeStories } from '@storybook/testing-react';

const { Checked, Default } = composeStories(stories);

describe('renders correctly', () => {
	it('when unchecked', () => {
		render(<Default />);

		expect(screen.getByRole('radio')).toMatchSnapshot();
	});

	it('when checked', () => {
		render(<Checked />);

		expect(screen.getByRole('radio')).toMatchSnapshot();
	});
});
