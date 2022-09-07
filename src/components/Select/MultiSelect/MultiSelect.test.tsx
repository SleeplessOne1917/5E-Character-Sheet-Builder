import { render, screen } from '@testing-library/react';
import * as stories from './MultiSelect.stories';
import { composeStories } from '@storybook/testing-react';

const { Default, Error, LotsOfOptions } = composeStories(stories);

describe('renders correctly', () => {
	it('by default', () => {
		render(<Default />);

		expect(screen.getByTestId('multi-select')).toMatchSnapshot();
	});

	it('with a lot of options', () => {
		render(<LotsOfOptions />);

		expect(screen.getByTestId('multi-select')).toMatchSnapshot();
	});

	it('with error', () => {
		render(<Error />);

		expect(screen.getByTestId('multi-select')).toMatchSnapshot();
	});
});
