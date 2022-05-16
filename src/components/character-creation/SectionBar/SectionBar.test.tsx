import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import SectionBar from './SectionBar';

const mockRouter = (pathname: string) => {
	const useRouter = jest.spyOn(require('next/router'), 'useRouter');
	const router = {
		push: () => Promise.resolve(),
		prefetch: () => Promise.resolve(),
		pathname
	};
	useRouter.mockReturnValue(router);
};

const mockMatchMedia = (matches: boolean) => {
	window.matchMedia = jest.fn().mockImplementationOnce(() => ({
		matches,
		addEventListener: () => {},
		removeEventListener: () => {}
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
