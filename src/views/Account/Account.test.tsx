import * as Router from 'next/navigation';
import * as stories from './Account.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/react';

const { Default } = composeStories(stories);

const mockRouter = (pathname: string) => {
	const useRouter = jest.spyOn(Router, 'useRouter');

	const router = {
		push: () => Promise.resolve(true),
		prefetch: () => Promise.resolve(),
		pathname,
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
		isReady: true,
		forward: () => {}
	};
	useRouter.mockReturnValue(router);
};

it('renders correctly', () => {
	mockRouter('/account');
	render(<Default />);

	expect(screen.getByTestId('account')).toMatchSnapshot();
});
