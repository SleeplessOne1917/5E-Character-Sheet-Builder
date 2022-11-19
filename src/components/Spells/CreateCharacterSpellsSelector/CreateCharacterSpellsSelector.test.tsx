import * as stories from './CreateCharacterSpellsSelector.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { Default } = composeStories(stories);

window.matchMedia = jest.fn().mockImplementation(() => ({
	matches: true,
	addEventListener: jest.fn(),
	removeEventListener: jest.fn()
}));

describe('renders correctly', () => {
	it('default', () => {
		render(<Default />);

		expect(screen.getByTestId('spells-selector')).toMatchSnapshot();
	});
});
