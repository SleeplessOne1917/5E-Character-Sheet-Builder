import { render, screen } from '@testing-library/react';
import * as stories from './ConfirmationModal.stories';
import { composeStories } from '@storybook/testing-react';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('confirmation-modal')).toMatchSnapshot();
});
