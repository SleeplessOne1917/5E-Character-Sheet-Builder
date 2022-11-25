import {
	TouchEvent,
	TouchEventHandler,
	useCallback,
	useEffect,
	useState
} from 'react';

import Link from 'next/link';
import { capitalize } from '../../../../services/capitalizeService';
import classes from './SectionBar.module.css';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import { usePathname } from 'next/navigation';

export enum Section {
	'race',
	'class',
	'abilities',
	'description',
	'equipment',
	'finish'
}

const sections = [
	{ section: 'race', snapPercent: 0 },
	{ section: 'class', snapPercent: 9 },
	{ section: 'abilities', snapPercent: 20 },
	{ section: 'description', snapPercent: 33 },
	{ section: 'equipment', snapPercent: 50 },
	{ section: 'finish', snapPercent: 60 }
];

const spellcastingSections = [
	{ section: 'race', snapPercent: 0 },
	{ section: 'class', snapPercent: 9 },
	{ section: 'abilities', snapPercent: 18 },
	{ section: 'spells', snapPercent: 27 },
	{ section: 'description', snapPercent: 38 },
	{ section: 'equipment', snapPercent: 50 },
	{ section: 'finish', snapPercent: 60 }
];

const getSections = (
	hasSpellcasting: boolean
): { section: string; snapPercent: number }[] =>
	hasSpellcasting ? spellcastingSections : sections;

const MAX_PERCENT = 60;

type SectionBarProps = {
	hasSpellcasting?: boolean;
};

const SectionBar = ({
	hasSpellcasting = false
}: SectionBarProps): JSX.Element => {
	const [translatePercent, setTranslatePercent] = useState(0);
	const [x0, setX0] = useState(0);
	const [selectedSection, setSelectedSection] = useState(
		getSections(hasSpellcasting)[0].section
	);
	const isMediumOrLarger = useMediaQuery('(min-width: 768px)');
	const pathname = usePathname();

	useEffect(() => {
		const sections = getSections(hasSpellcasting);
		const pathRegex = new RegExp(
			String.raw`\/create\/character\/(${sections
				.map(({ section }) => section)
				.join('|')})`
		);
		const match = pathname.match(pathRegex);

		if (match) {
			const key = match[1];
			setSelectedSection(key);
			setTranslatePercent(
				sections.find(section => section.section === key)?.snapPercent as number
			);
		}
	}, [pathname, hasSpellcasting]);

	const getClosestToSnapPercent = useCallback(
		(n: number): number => {
			const diffs = [];
			for (const snapPercent of getSections(hasSpellcasting).map(
				({ snapPercent }) => snapPercent
			)) {
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
		},
		[hasSpellcasting]
	);

	const calculatePercent = useCallback(
		(event: TouchEvent<HTMLUListElement>): number => {
			const dx = (event.changedTouches[0].clientX - x0) / 700;

			return Math.max(0, Math.min(translatePercent - dx, MAX_PERCENT));
		},
		[translatePercent, x0]
	);

	const handleSwipe: TouchEventHandler<HTMLUListElement> = useCallback(
		(event: TouchEvent<HTMLUListElement>) => {
			setTranslatePercent(calculatePercent(event));
		},
		[setTranslatePercent, calculatePercent]
	);

	const handleTouchUp: TouchEventHandler<HTMLUListElement> = useCallback(
		(event: TouchEvent<HTMLUListElement>) => {
			const percent = calculatePercent(event);
			setTranslatePercent(getClosestToSnapPercent(percent));
		},
		[setTranslatePercent, getClosestToSnapPercent, calculatePercent]
	);

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
				{getSections(hasSpellcasting).map(section => (
					<li key={section.section}>
						<Link
							href={`/create/character/${section.section}`}
							passHref
							legacyBehavior
						>
							<a
								className={`${classes.link}${
									section.section === selectedSection
										? ` ${classes['link-selected']}`
										: ''
								}`}
								onClick={() => setTranslatePercent(section.snapPercent)}
								style={
									section.section === selectedSection
										? { transform: 'translateY(0)' }
										: {}
								}
							>
								{capitalize(section.section)}
							</a>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default SectionBar;
