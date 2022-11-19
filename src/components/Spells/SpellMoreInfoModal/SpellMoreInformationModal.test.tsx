import * as stories from './SpellMoreInformationModal.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { Default, Loading, Error } = composeStories(stories);

describe('redners correctly', () => {
	it('default', () => {
		render(<Default />);

		expect(
			screen.getByTestId('spell-more-information-modal')
		).toMatchSnapshot();
	});

	it('loading', () => {
		render(<Loading />);

		expect(
			screen.getByTestId('spell-more-information-modal')
		).toMatchSnapshot();
	});

	it('error', () => {
		render(<Error />);

		expect(
			screen.getByTestId('spell-more-information-modal')
		).toMatchSnapshot();
	});
});
