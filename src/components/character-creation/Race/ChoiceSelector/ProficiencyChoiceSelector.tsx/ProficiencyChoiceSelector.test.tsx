import * as stories from './ProficiencyChoiceSelector.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('choice-selector')).toMatchSnapshot();
});
