import * as Router from 'next/navigation';
import * as stories from './CreateIndex.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { Default } = composeStories(stories);

const mockRouter = () => {
	const useRouter = jest.spyOn(Router, 'usePathname');
	useRouter.mockReturnValue('/create');
};

beforeEach(() => {
	mockRouter();
});

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('create-index')).toMatchSnapshot();
});
