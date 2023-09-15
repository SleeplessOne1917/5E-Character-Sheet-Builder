import { render, screen } from '@testing-library/react';
import * as stories from './HitPointsModal.stories';

import { composeStories } from '@storybook/react';

const { ClassSelected, NoClassSelected } = composeStories(stories);

describe('renders correctly', () => {
	it('when no class is selected', () => {
		render(<NoClassSelected />);

		expect(screen.getByTestId('hit-points-modal')).toMatchSnapshot();
	});

	it('when class is selected', () => {
		render(<ClassSelected />);

		expect(screen.getByTestId('hit-points-modal')).toMatchSnapshot();
	});
});
