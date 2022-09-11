import { render, screen } from '@testing-library/react';

import * as stories from './MarkdownTextArea.stories';

import { composeStories } from '@storybook/testing-react';

const { Default, Error } = composeStories(stories);

describe('renders correctly', () => {
	it('by default', () => {
		render(<Default />);

		expect(screen.getByTestId('markdown-text-area')).toMatchSnapshot();
	});

	it('with error showing', () => {
		render(<Error />);

		expect(screen.getByTestId('markdown-text-area')).toMatchSnapshot();
	});
});
