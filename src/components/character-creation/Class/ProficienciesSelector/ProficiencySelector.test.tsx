import { render, screen } from '@testing-library/react';
import * as stories from './ProficienciesSelector.stories';
import { composeStories } from '@storybook/testing-react';

const { Default, WithTypes } = composeStories(stories);

describe('renders correctly', () => {
	it('when default', () => {
		render(<Default />);

		expect(screen.getByTestId('proficiencies-selector')).toMatchSnapshot();
	});

	it('with types', () => {
		render(<WithTypes />);

		expect(screen.getByTestId('proficiencies-selector')).toMatchSnapshot();
	});
});
