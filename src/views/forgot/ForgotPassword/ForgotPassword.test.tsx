import * as Router from 'next/navigation';
import * as stories from './ForgotPassword.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/react';

const { Default } = composeStories(stories);

const mockRouter = (pathname: string) => {
	const useRouter = jest.spyOn(Router, 'useRouter');

	const router: Router.NextRouter = {
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
	mockRouter('/forgot/password');
	render(<Default />);

	expect(screen.getByTestId('forgot-password')).toMatchSnapshot();
});
