import { TouchEvent, TouchEventHandler, useEffect, useState } from 'react';

import Link from 'next/link';
import classes from './SectionBar.module.css';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { useRouter } from 'next/router';

export enum Section {
	'race',
	'class',
	'abilities',
	'description',
	'equipment',
	'finish'
}

const getSections = (): string[] =>
	Object.keys(Section).filter(key => isNaN(Number(key)));

const snapPercents = [0, 9, 20, 33, 50, 60];

const MAX_PERCENT = 60;

const capitalize = (str: string) => {
	const [first, ...rest] = str;
	return first.toUpperCase() + rest.join('').toLowerCase();
};

const getClosestToSnapPercent = (n: number): number => {
	const diffs = [];
	for (const snapPercent of snapPercents) {
		diffs.push({ diff: Math.abs(n - snapPercent), value: snapPercent });
	}

	diffs.sort((a, b) => {
		if (a.diff < b.diff) {
			return -1;
		} else if (b.diff < a.diff) {
			return 1;
		} else {
			return 0;
		}
	});

	return diffs[0].value;
};

const SectionBar = (): JSX.Element => {
	const [translatePercent, setTranslatePercent] = useState(0);
	const [x0, setX0] = useState(0);
	const [selectedSection, setSelectedSection] = useState(Section[0]);
	const { pathname } = useRouter();
	const isMediumOrLarger = useMediaQuery('(min-width: 768px)');

	useEffect(() => {
		const pathRegex = new RegExp(
			String.raw`\/create\/(${getSections().join('|')})`
		);
		const match = pathname.match(pathRegex);

		if (match) {
			const key = match[1];
			setSelectedSection(key);
			setTranslatePercent(snapPercents[Section[key]]);
		}
	}, [pathname]);

	const calculatePercent = (event: TouchEvent<HTMLUListElement>): number => {
		const dx = (event.changedTouches[0].clientX - x0) / 700;

		return Math.max(0, Math.min(translatePercent - dx, MAX_PERCENT));
	};

	const handleSwipe: TouchEventHandler<HTMLUListElement> = (
		event: TouchEvent<HTMLUListElement>
	) => {
		setTranslatePercent(calculatePercent(event));
	};

	const handleTouchUp: TouchEventHandler<HTMLUListElement> = (
		event: TouchEvent<HTMLUListElement>
	) => {
		const percent = calculatePercent(event);
		setTranslatePercent(getClosestToSnapPercent(percent));
	};

	return (
		<nav className={classes['section-bar']}>
			<ul
				className={classes['section-list']}
				style={
					isMediumOrLarger
						? {}
						: {
								transform: `translateX(-${translatePercent}%)`
						  }
				}
				onTouchStart={event => setX0(event.changedTouches[0].clientX)}
				onTouchEnd={handleTouchUp}
				onTouchMove={handleSwipe}
				data-testid="section-list"
			>
				{getSections().map((key, index) => (
					<li key={key}>
						<Link href={`/create/${key}`}>
							<a
								className={`${classes.link}${
									key === selectedSection ? ` ${classes['link-selected']}` : ''
								}`}
								onClick={() => setTranslatePercent(snapPercents[index])}
								style={
									key === selectedSection ? { transform: 'translateY(0)' } : {}
								}
							>
								{capitalize(key)}
							</a>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default SectionBar;
