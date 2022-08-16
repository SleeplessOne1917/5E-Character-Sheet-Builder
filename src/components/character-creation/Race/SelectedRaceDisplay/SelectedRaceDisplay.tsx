import {
	CSSProperties,
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import {
	ProficiencyType,
	SrdFullRaceItem,
	SrdFullSubraceItem,
	SrdItemChoice,
	SrdProficiencyItem,
	SrdProficiencyItemChoice,
	SrdSpellItem,
	SrdSpellItemChoice,
	SrdSubtraitItemChoice
} from '../../../../types/srd';


import {
	addProficiency,
	removeProficiency
} from '../../../../redux/features/proficiencies';
import {
	deselectTraitProficiencies,
	deselectTraitSpells,
	selectTraitProficiencies,
	selectTraitSpells
} from '../../../../redux/features/raceInfo';
import { addSpell, removeSpell } from '../../../../redux/features/spells';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';

import AbilityBonusChoiceSelector from '../ChoiceSelector/AbilityBonusChoiceSelector/AbilityBonusChoiceSelector';
import BreathWeaponDisplay from '../BreathWeaponDisplay/BreathWeaponDisplay';
import Descriptor from '../../Descriptor/Descriptor';
import DraconicAncestryChoiceSelector from '../ChoiceSelector/DraconicAncestryChoiceSelector/DraconicAncestryChoiceSelector';
import LanguageChoiceSelector from '../ChoiceSelector/LanguageChoiceSelector/LanguageChoiceSelector';
import ProficiencyChoiceSelector from '../ChoiceSelector/ProficiencyChoiceSelector.tsx/ProficiencyChoiceSelector';
import SpellChoiceSelector from '../ChoiceSelector/SpellChoiceSelector/SpellChoiceSelector';
import classes from './SelectedRaceDisplay.module.css';
import { getAbilityScoreDescription } from '../../../../services/abilityBonusService';
import useMediaQuery from '../../../../hooks/useMediaQuery';

type SelectedRaceDisplayProps = {
	race: SrdFullRaceItem;
	subrace?: SrdFullSubraceItem;
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

const SelectedRaceDisplay = ({
	race,
	subrace
}: SelectedRaceDisplayProps): JSX.Element => {
	const traits = race.traits.concat(subrace ? subrace.racial_traits : []);
	const isLargeOrLarger = useMediaQuery('(min-width: 1024px)');
	const summaryRef = useRef<HTMLDivElement>();
	const iconRef = useRef<HTMLDivElement>();
	const [containerStyle, setContainerStyle] = useState<CSSProperties>();
	const dispatch = useAppDispatch();
	const raceInfo = useAppSelector(state => state.editingCharacter.raceInfo);

	useEffect(() => {
		const adjustRows = () => {
			if (isLargeOrLarger) {
				setContainerStyle({
					gridTemplateRows: `${Math.max(
						summaryRef.current?.offsetHeight as number,
						iconRef.current?.offsetHeight as number
					)}px auto`
				});
			} else {
				setContainerStyle(undefined);
			}
		};

		adjustRows();

		window.addEventListener('resize', adjustRows);

		return () => {
			window.removeEventListener('resize', adjustRows);
		};
	}, [isLargeOrLarger, setContainerStyle, raceInfo.draconicAncestry]);

	const handleTraitProficienciesApply = useCallback(
		(index: string) => {
			return (proficiencies: SrdProficiencyItem[]) => {
				dispatch(selectTraitProficiencies({ index, proficiencies }));

				for (const proficiency of proficiencies) {
					dispatch(addProficiency(proficiency));
				}
			};
		},
		[dispatch]
	);

	const handleTraitProficienciesReset = useCallback(
		(traitIndex: string) => {
			return (proficiencies: SrdProficiencyItem[]) => {
				dispatch(deselectTraitProficiencies(traitIndex));

				for (const { index } of proficiencies) {
					dispatch(removeProficiency(index));
				}
			};
		},
		[dispatch]
	);

	const handleTraitSpellsApply = useCallback(
		(traitIndex: string) => {
			return (spells: SrdSpellItem[]) => {
				dispatch(selectTraitSpells({ index: traitIndex, spells }));

				for (const spell of spells) {
					dispatch(addSpell(spell));
				}
			};
		},
		[dispatch]
	);

	const handleTraitSpellsReset = useCallback(
		(traitIndex: string) => {
			return (spells: SrdSpellItem[]) => {
				dispatch(deselectTraitSpells(traitIndex));

				for (const { index } of spells) {
					dispatch(removeSpell(index));
				}
			};
		},
		[dispatch]
	);

	const draconicAncestryTrait = traits.find(
		trait => trait.index === 'draconic-ancestry'
	);

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
					<div className={classes['summary-item']}>
						<div className={classes['summary-item-header']}>
							Ability Bonuses
						</div>
						<div className={classes['summary-item-data']}>
							{getAbilityScoreDescription(
								{ ability_bonuses: race.ability_bonuses },
								subrace
							)}
						</div>
					</div>
				</div>
				{raceInfo.draconicAncestry && (
					<BreathWeaponDisplay
						breathWeapon={
							raceInfo.draconicAncestry.trait_specific.breath_weapon
						}
					/>
				)}
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
					<LanguageChoiceSelector
						choice={race.language_options}
						label={`Select ${race.language_options.choose} language${
							race.language_options.choose > 1 ? 's' : ''
						}`}
					/>
				)}
				{traits
					.filter(trait => trait.language_options)
					.map(trait => (
						<LanguageChoiceSelector
							key={`selector-${trait.index}`}
							choice={trait.language_options as SrdItemChoice}
							label={`${trait.name}: select ${
								(trait.language_options as SrdItemChoice).choose
							} language${
								(trait.language_options as SrdItemChoice)?.choose > 1 ? 's' : ''
							}`}
							traitIndex={trait.index}
						/>
					))}
				{draconicAncestryTrait && (
					<DraconicAncestryChoiceSelector
						choice={
							draconicAncestryTrait.trait_specific
								?.subtrait_options as SrdSubtraitItemChoice
						}
					/>
				)}
				{traits
					.filter(trait => trait.proficiency_choices)
					.map(trait => (
						<ProficiencyChoiceSelector
							key={`selector-${trait.index}`}
							choice={trait.proficiency_choices as SrdProficiencyItemChoice}
							label={`${trait.name}: select ${
								trait.proficiency_choices?.choose
							} ${getLabelFromProficiencyType(
								(trait.proficiency_choices?.from.options ?? [])[0]?.item
									?.type as ProficiencyType
							)} proficienc${
								(trait.proficiency_choices?.choose ?? 1) > 1 ? 'ies' : 'y'
							}`}
							onApply={handleTraitProficienciesApply(trait.index)}
							onReset={handleTraitProficienciesReset(trait.index)}
							initialValues={
								raceInfo.selectedTraitProficiencies[trait.index]
									? raceInfo.selectedTraitProficiencies[trait.index].map(
											({ index }) => index
									  )
									: undefined
							}
						/>
					))}
				{traits
					.filter(trait => trait.trait_specific?.spell_options)
					.map(trait => (
						<SpellChoiceSelector
							key={`${trait.index}-choice-selector`}
							traitName={trait.name}
							choice={trait.trait_specific?.spell_options as SrdSpellItemChoice}
							onApply={handleTraitSpellsApply(trait.index)}
							onReset={handleTraitSpellsReset(trait.index)}
							initialValues={
								raceInfo.selectedTraitSpells[trait.index]
									? raceInfo.selectedTraitSpells[trait.index].map(
											({ index }) => index
									  )
									: undefined
							}
						/>
					))}
			</div>
			<div className={classes.traits}>
				<h2 className={classes['traits-title']}>Traits</h2>
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
