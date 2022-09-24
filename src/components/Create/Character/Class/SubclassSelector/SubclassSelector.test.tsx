import * as stories from './SubclassSelector.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { Default, Selected } = composeStories(stories);

describe('renders correctly', () => {
	it('normally', () => {
		render(<Default />);

		expect(screen.getByTestId('subclass-selector')).toMatchSnapshot();
	});

	it('when selected', () => {
		render(<Selected />);

		expect(screen.getByTestId('subclass-selector')).toMatchSnapshot();
	});
});
