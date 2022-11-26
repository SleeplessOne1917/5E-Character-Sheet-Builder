import '@testing-library/jest-dom';

import * as Router from 'next/navigation';

import { render, screen } from '@testing-library/react';

import SectionBar from './SectionBar';

const mockPathname = (pathname: string) => {
	const useRouter = jest.spyOn(Router, 'usePathname');

	useRouter.mockReturnValue(pathname);
};

const mockMatchMedia = (matches: boolean) => {
	window.matchMedia = jest.fn().mockImplementationOnce(() => ({
		matches,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn()
	}));
};

describe('renders correctly', () => {
	it('normally', () => {
		mockMatchMedia(true);
		mockPathname('/create/character/race/');

		render(<SectionBar />);

		expect(screen.getByRole('navigation')).toMatchSnapshot();
	});

	it('with spells', () => {
		mockMatchMedia(true);
		mockPathname('/create/character/race/');

		render(<SectionBar hasSpellcasting />);

		expect(screen.getByRole('navigation')).toMatchSnapshot();
	});
});

describe('snaps to snapPercents', () => {
	beforeEach(() => {
		mockMatchMedia(false);
	});

	it('at race', () => {
		mockPathname('/create/character/race/');
		render(<SectionBar />);

		expect(screen.getByTestId(/section-list/i)).toHaveStyle(
			'transform: translateX(-0%)'
		);
	});

	it('at class', () => {
		mockPathname('/create/character/class/');
		render(<SectionBar />);

		expect(screen.getByTestId(/section-list/i)).toHaveStyle(
			'transform: translateX(-9%)'
		);
	});

	it('at abilities', () => {
		mockPathname('/create/character/abilities/');
		render(<SectionBar />);

		expect(screen.getByTestId(/section-list/i)).toHaveStyle(
			'transform: translateX(-20%)'
		);
	});

	it('at description', () => {
		mockPathname('/create/character/description/');
		render(<SectionBar />);

		expect(screen.getByTestId(/section-list/i)).toHaveStyle(
			'transform: translateX(-33%)'
		);
	});

	it('at equipment', () => {
		mockPathname('/create/character/equipment/');
		render(<SectionBar />);

		expect(screen.getByTestId(/section-list/i)).toHaveStyle(
			'transform: translateX(-50%)'
		);
	});

	it('at finish', () => {
		mockPathname('/create/character/finish/');
		render(<SectionBar />);

		expect(screen.getByTestId(/section-list/i)).toHaveStyle(
			'transform: translateX(-60%)'
		);
	});
});
