import { render, screen } from '@testing-library/react';
import * as stories from './FavoredEnemySelector.stories';
import { composeStories } from '@storybook/testing-react';

const { Default, Humanoid } = composeStories(stories);

describe('renders correctly', () => {
	it('when default', () => {
		render(<Default />);

		expect(screen.getByTestId('favored-enemy-selector')).toMatchSnapshot();
	});

	it('when humanoid', () => {
		render(<Humanoid />);

		expect(screen.getByTestId('favored-enemy-selector')).toMatchSnapshot();
	});
});
