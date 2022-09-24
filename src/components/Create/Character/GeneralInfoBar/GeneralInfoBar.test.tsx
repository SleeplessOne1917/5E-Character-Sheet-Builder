import * as stories from './GeneralInfoBar.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('general-info-bar')).toMatchSnapshot();
});
