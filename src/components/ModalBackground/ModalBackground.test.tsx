import { render, screen } from '@testing-library/react';
import * as stories from './ModalBackground.stories';
import { composeStories } from '@storybook/react';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('modal-background')).toMatchSnapshot();
});
