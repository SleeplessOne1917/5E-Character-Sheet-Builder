import {
	SrdItemChoice,
	SrdProficiencyItem,
	SrdRace,
	SrdSubrace,
	ProficiencyType,
	SrdTrait
} from '../../../../types/srd';
import AbilityBonusChoiceSelector from '../ChoiceSelector/AbilityBonusChoiceSelector/AbilityBonusChoiceSelector';
import SrdItemChoiceSelector from '../ChoiceSelector/SrdItemChoiceSelector/SrdItemChoiceSelector';

import classes from './SelectedRaceDisplay.module.css';
import Descriptor from '../../Descriptor/Descriptor';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import {
	CSSProperties,
	MutableRefObject,
	useRef,
	useState,
	useEffect
} from 'react';

type SelectedRaceDisplayProps = {
	race: SrdRace;
	subrace?: SrdSubrace;
};

const getLabelFromProficiencyType = (type: ProficiencyType) => {
	switch (type) {
		case 'WEAPONS':
			return 'weapon';
		case 'ARMOR':
			return 'armor';
		case 'ARTISANS_TOOLS':
			return "artisan's tool";
		case 'GAMING_SETS':
			return 'gaming set';
		case 'MUSICAL_INSTRUMENTS':
			return 'musical instrument';
		case 'OTHER':
			return 'other';
		case 'SAVING_THROWS':
			'saving throw';
		case 'SKILLS':
			return 'skill';
		case 'VEHICLES':
			return 'vehicle';
	}
};

const mapTraitsToProficiencySelectors = (traits: SrdTrait[]) =>
	traits.map(trait => (
		<SrdItemChoiceSelector
			key={trait.index}
			choice={trait.proficiency_choices as SrdItemChoice}
			label={`${trait.name}: select ${
				trait.proficiency_choices?.choose
			} ${getLabelFromProficiencyType(
				(trait.proficiency_choices?.from.options[0].item as SrdProficiencyItem)
					.type
			)} proficienc${
				(trait.proficiency_choices?.choose ?? 1) > 1 ? 'ies' : 'y'
			}`}
		/>
	));

const SelectedRaceDisplay = ({
	race,
	subrace
}: SelectedRaceDisplayProps): JSX.Element => {
	const traits = race.traits.concat(subrace ? subrace.racial_traits : []);
	const isLargeOrLarger = useMediaQuery('(min-width: 1024px)');
	const summaryRef = useRef<HTMLDivElement>();
	const iconRef = useRef<HTMLDivElement>();
	const [containerStyle, setContainerStyle] = useState<CSSProperties>();

	useEffect(() => {
		if (isLargeOrLarger) {
			setContainerStyle({
				gridTemplateRows: `${Math.max(
					summaryRef.current?.offsetHeight as number,
					iconRef.current?.offsetHeight as number
				)}px auto`
			});
		}
	}, [isLargeOrLarger, setContainerStyle, summaryRef, iconRef]);

	return (
		<div className={classes.container} style={containerStyle}>
			<div
				className={classes.summary}
				ref={summaryRef as MutableRefObject<HTMLDivElement>}
			>
				<div className={classes['summary-bar']}>
					<div className={classes['summary-item']}>
						<div className={classes['summary-item-header']}>Speed</div>
						<div className={classes['summary-item-data']}>{race.speed}ft</div>
					</div>
					<div className={classes['summary-item']}>
						<div className={classes['summary-item-header']}>Size</div>
						<div
							className={classes['summary-item-data']}
						>{`${race.size[0].toUpperCase()}${race.size
							.slice(1)
							.toLowerCase()}`}</div>
					</div>
					<div className={classes['summary-item']}>
						<div className={classes['summary-item-header']}>Languages</div>
						<div className={classes['summary-item-data']}>
							{race.languages.map(language => language.name).join(', ')}
						</div>
					</div>
				</div>
				{subrace && <p>{subrace.desc}</p>}
			</div>
			<div
				className={classes['icon-container']}
				ref={iconRef as MutableRefObject<HTMLDivElement>}
			>
				<svg className={classes.icon}>
					<use xlinkHref={`/Icons.svg#${race.index}`} />
				</svg>
			</div>
			<div className={classes.select}>
				{race.ability_bonus_options && (
					<AbilityBonusChoiceSelector choice={race.ability_bonus_options} />
				)}
				{race.language_options && (
					<SrdItemChoiceSelector
						choice={race.language_options}
						label={`Select language${
							race.language_options.choose > 1 ? 's' : ''
						}`}
					/>
				)}
				{mapTraitsToProficiencySelectors(
					traits.filter(trait => trait.proficiency_choices)
				)}
			</div>
			<div className={classes.traits}>
				{traits.map(trait => (
					<Descriptor
						key={trait.index}
						title={trait.name}
						description={trait.desc}
					/>
				))}
			</div>
		</div>
	);
};

export default SelectedRaceDisplay;
