import * as stories from './Class.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/react';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('class')).toMatchSnapshot();
});
