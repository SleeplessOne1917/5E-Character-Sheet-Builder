import * as stories from './Preview.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('preview')).toMatchSnapshot();
});
