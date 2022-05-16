import '@testing-library/jest-dom';

import * as stories from './Descriptor.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';

const { Closed, MultipleParagraphs, OneParagraph } = composeStories(stories);

describe('renders correctly', () => {
	it('when closed', () => {
		render(<Closed />);

		expect(screen.getByTestId(/descriptor/i)).toMatchSnapshot();
	});

	it('when open with single paragraph', () => {
		render(<OneParagraph />);

		expect(screen.getByTestId(/descriptor/i)).toMatchSnapshot();
	});

	it('when open with multiple paragraphs', () => {
		render(<MultipleParagraphs />);

		expect(screen.getByTestId(/descriptor/i)).toMatchSnapshot();
	});
});

describe('calls toggleOpen', () => {
	it('on click', async () => {
		const toggleOpenMock = jest.fn();

		render(<Closed toggleOpen={toggleOpenMock} />);

		await userEvent.click(screen.getByRole('button'));

		expect(toggleOpenMock).toHaveBeenCalled();
	});

	it('on enter keypress', async () => {
		const toggleOpenMock = jest.fn();

		render(<Closed toggleOpen={toggleOpenMock} />);

		await userEvent.tab();
		await userEvent.keyboard('{Enter}');

		expect(toggleOpenMock).toHaveBeenCalled();
	});

	it('on space keypress', async () => {
		const toggleOpenMock = jest.fn();

		render(<Closed toggleOpen={toggleOpenMock} />);

		await userEvent.tab();
		await userEvent.keyboard(' ');

		expect(toggleOpenMock).toHaveBeenCalled();
	});
});

describe('has expected styles', () => {
	it('when closed', () => {
		render(<Closed />);

		expect(screen.getByText(/Foo/i)).toHaveStyle({
			'border-bottom-left-radius': '0.5rem',
			'border-bottom-right-radius': '0.5rem'
		});
	});

	it('when open', () => {
		render(<OneParagraph />);

		expect(screen.getByText(/Bar/i)).toHaveStyle({
			'border-bottom-left-radius': '0',
			'border-bottom-right-radius': '0'
		});
	});
});
