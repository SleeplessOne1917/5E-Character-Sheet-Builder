import '@testing-library/jest-dom';

import * as stories from './Descriptor.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';

const { MultipleParagraphs, OneParagraph } = composeStories(stories);

describe('renders correctly', () => {
	it('when open with single paragraph', () => {
		render(<OneParagraph />);

		expect(screen.getByTestId(/descriptor/i)).toMatchSnapshot();
	});

	it('when open with multiple paragraphs', () => {
		render(<MultipleParagraphs />);

		expect(screen.getByTestId(/descriptor/i)).toMatchSnapshot();
	});
});

describe('has expected styles', () => {
	it('when closed', () => {
		render(<OneParagraph />);

		expect(screen.getByText(/Bar/i)).toHaveStyle({
			'border-bottom-left-radius': '0.5rem',
			'border-bottom-right-radius': '0.5rem'
		});
	});

	it('when open', async () => {
		render(<OneParagraph />);

		await userEvent.click(screen.getByText(/Bar/i));

		expect(screen.getByText(/Bar/i)).toHaveStyle({
			'border-bottom-left-radius': '0',
			'border-bottom-right-radius': '0'
		});
	});
});
