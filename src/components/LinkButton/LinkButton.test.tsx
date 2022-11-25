import * as Router from 'next/navigation';
import * as stories from './LinkButton.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { Default, Untabbable } = composeStories(stories);

beforeAll(() => {
	const useRouter = jest.spyOn(Router, 'useRouter');
	const router: Router.NextRouter = {
		push: () => Promise.resolve(true),
		prefetch: () => Promise.resolve(),
		route: '',
		query: {},
		pathname: '',
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
});

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByRole('link')).toMatchSnapshot();
});

it('sets default tab index when not passed in', () => {
	render(<Default />);

	expect(screen.getByRole('link').tabIndex).toBe(0);
});

it('sets passed in properties', () => {
	render(<Untabbable />);

	const { tabIndex, href } = screen.getByRole('link') as HTMLLinkElement;
	expect(tabIndex).toBe(Untabbable.args?.tabIndex);
	expect(href).toContain(Untabbable.args?.href);
});
