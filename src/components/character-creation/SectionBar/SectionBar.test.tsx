import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import SectionBar from './SectionBar';

import * as Router from 'next/router';

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
		isReady: true
	};
	useRouter.mockReturnValue(router);
};

const mockMatchMedia = (matches: boolean) => {
	window.matchMedia = jest.fn().mockImplementationOnce(() => ({
		matches,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn()
	}));
};

it('renders correctly', () => {
	mockMatchMedia(true);
	mockRouter('/create/race/');

	render(<SectionBar />);

	expect(screen.getByRole('navigation')).toMatchSnapshot();
});

describe('snaps to snapPercents', () => {
	beforeEach(() => {
		mockMatchMedia(false);
	});

	it('at race', () => {
		mockRouter('/create/race/');
		render(<SectionBar />);

		expect(screen.getByTestId(/section-list/i)).toHaveStyle(
			'transform: translateX(-0%)'
		);
	});

	it('at class', () => {
		mockRouter('/create/class/');
		render(<SectionBar />);

		expect(screen.getByTestId(/section-list/i)).toHaveStyle(
			'transform: translateX(-9%)'
		);
	});

	it('at abilities', () => {
		mockRouter('/create/abilities/');
		render(<SectionBar />);

		expect(screen.getByTestId(/section-list/i)).toHaveStyle(
			'transform: translateX(-20%)'
		);
	});

	it('at description', () => {
		mockRouter('/create/description/');
		render(<SectionBar />);

		expect(screen.getByTestId(/section-list/i)).toHaveStyle(
			'transform: translateX(-33%)'
		);
	});

	it('at equipment', () => {
		mockRouter('/create/equipment/');
		render(<SectionBar />);

		expect(screen.getByTestId(/section-list/i)).toHaveStyle(
			'transform: translateX(-50%)'
		);
	});

	it('at finish', () => {
		mockRouter('/create/finish/');
		render(<SectionBar />);

		expect(screen.getByTestId(/section-list/i)).toHaveStyle(
			'transform: translateX(-60%)'
		);
	});
});
