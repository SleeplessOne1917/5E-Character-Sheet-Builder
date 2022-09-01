import { render, screen } from '@testing-library/react';
import * as stories from './CreateIndex.stories';

import { composeStories } from '@storybook/testing-react';

const { Default } = composeStories(stories);

import * as Router from 'next/router';

const mockRouter = () => {
	const useRouter = jest.spyOn(Router, 'useRouter');

	const router: Router.NextRouter = {
		push: () => Promise.resolve(true),
		prefetch: () => Promise.resolve(),
		pathname: '',
		route: '',
		query: {},
		asPath: '',
		basePath: '',
		isLocaleDomain: true,
		reload: jest.fn(),
		replace: jest.fn(),
		back: jest.fn(),
		beforePopState: jest.fn(),
		events: { emit: jest.fn(), on: jest.fn(), off: jest.fn() },
		isFallback: false,
		isPreview: false,
		isReady: true
	};
	useRouter.mockReturnValue(router);
};

beforeEach(() => {
	mockRouter();
});

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('create-index')).toMatchSnapshot();
});
