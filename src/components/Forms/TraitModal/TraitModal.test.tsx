import * as stories from './TraitModal.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { Include, Omit } = composeStories(stories);

describe('redners correctly', () => {
	it('include', () => {
		render(<Include />);

		expect(screen.getByTestId('trait-modal')).toMatchSnapshot();
	});

	it('omit', () => {
		render(<Omit />);

		expect(screen.getByTestId('trait-modal')).toMatchSnapshot();
	});
});
