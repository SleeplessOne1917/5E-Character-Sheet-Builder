import { render, screen } from '@testing-library/react';
import * as stories from './SpellMoreInformationModal.stories';
import { composeStories } from '@storybook/testing-react';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('spell-more-information-modal')).toMatchSnapshot();
});
