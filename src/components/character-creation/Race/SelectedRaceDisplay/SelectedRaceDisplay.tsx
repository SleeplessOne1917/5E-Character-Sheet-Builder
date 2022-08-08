import {
	AbilityBonus,
	ProficiencyType,
	SrdItem,
	SrdItemChoice,
	SrdProficiencyItem,
	SrdProficiencyItemChoice,
	SrdRace,
	SrdSpellItemChoice,
	SrdSubrace,
	SrdSubtraitItem,
	SrdSubtraitItemChoice
} from '../../../../types/srd';
import {
	CSSProperties,
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import {
	addLanguage,
	removeLanguage
} from '../../../../redux/features/languages';
import {
	addProficiency,
	removeProficiency
} from '../../../../redux/features/proficiencies';
import {
	deselectAbilityBonuses,
	deselectDraconicAncestry,
	deselectLanguages,
	deselectTraitLanguages,
	deselectTraitProficiencies,
	selectAbilityBonuses,
	selectDraconicAncestry,
	selectLanguages,
	selectTraitLanguages,
	selectTraitProficiencies
} from '../../../../redux/features/raceInfo';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';

import AbilityBonusChoiceSelector from '../ChoiceSelector/AbilityBonusChoiceSelector/AbilityBonusChoiceSelector';
import Descriptor from '../../Descriptor/Descriptor';
import LanguageChoiceSelector from '../ChoiceSelector/LanguageChoiceSelector/LanguageChoiceSelector';
import ProficiencyChoiceSelector from '../ChoiceSelector/ProficiencyChoiceSelector.tsx/ProficiencyChoiceSelector';
import classes from './SelectedRaceDisplay.module.css';
import { getAbilityScoreDescription } from '../../../../services/abilityBonusService';
import { updateRaceBonus } from '../../../../redux/features/abilityScores';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import DraconicAncestryChoiceSelector from '../ChoiceSelector/DraconicAncestryChoiceSelector/DraconicAncestryChoiceSelector';
import BreathWeaponDisplay from '../BreathWeaponDisplay/BreathWeaponDisplay';
import SpellChoiceSelector from '../ChoiceSelector/SpellChoiceSelector/SpellChoiceSelector';

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
	}, [
		isLargeOrLarger,
		setContainerStyle,
		summaryRef,
		iconRef,
		raceInfo.draconicAncestry
	]);

	const handleAbilityScoreBonusApply = useCallback(
		(bonuses: AbilityBonus[]) => {
			dispatch(selectAbilityBonuses(bonuses));

			for (const {
				bonus,
				ability_score: { index }
			} of bonuses) {
				dispatch(updateRaceBonus({ value: bonus, abilityIndex: index }));
			}
		},
		[dispatch]
	);

	const handleAbilityScoreBonusReset = useCallback(
		(bonuses: AbilityBonus[]) => {
			dispatch(deselectAbilityBonuses());

			for (const index of bonuses.map(bonus => bonus.ability_score.index)) {
				dispatch(updateRaceBonus({ value: null, abilityIndex: index }));
			}
		},
		[dispatch]
	);

	const handleLanguageOptionsApply = useCallback(
		(items: SrdItem[]) => {
			dispatch(selectLanguages(items));
			for (const language of items) {
				dispatch(addLanguage(language));
			}
		},
		[dispatch]
	);

	const handleLanguageOptionsReset = useCallback(
		(items: SrdItem[]) => {
			dispatch(deselectLanguages());
			for (const { index } of items) {
				dispatch(removeLanguage(index));
			}
		},
		[dispatch]
	);

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

	const handleTraitLanguagesApply = useCallback(
		(index: string) => {
			return (languages: SrdItem[]) => {
				dispatch(selectTraitLanguages({ index, languages }));

				for (const language of languages) {
					dispatch(addLanguage(language));
				}
			};
		},
		[dispatch]
	);

	const handleTraitLanguagesReset = useCallback(
		(traitIndex: string) => {
			return (languages: SrdItem[]) => {
				dispatch(deselectTraitLanguages(traitIndex));

				for (const { index } of languages) {
					dispatch(removeLanguage(index));
				}
			};
		},
		[dispatch]
	);

	const handleDraconicAncestryApply = useCallback(
		(ancestry: SrdSubtraitItem) => {
			dispatch(selectDraconicAncestry(ancestry));
		},
		[dispatch]
	);

	const handleDraconicAncestryReset = useCallback(() => {
		dispatch(deselectDraconicAncestry());
	}, [dispatch]);

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
					<AbilityBonusChoiceSelector
						choice={race.ability_bonus_options}
						onApply={handleAbilityScoreBonusApply}
						initialValues={raceInfo.selectedAbilityScoreBonuses?.map(
							bonus => bonus.ability_score.index
						)}
						onReset={handleAbilityScoreBonusReset}
					/>
				)}
				{race.language_options && (
					<LanguageChoiceSelector
						choice={race.language_options}
						label={`Select ${race.language_options.choose} language${
							race.language_options.choose > 1 ? 's' : ''
						}`}
						onApply={handleLanguageOptionsApply}
						onReset={handleLanguageOptionsReset}
						initialValues={raceInfo.selectedLanguages?.map(
							language => language.index
						)}
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
							onApply={handleTraitLanguagesApply(trait.index)}
							onReset={handleTraitLanguagesReset(trait.index)}
							initialValues={raceInfo.selectedTraitLanguages[trait.index]?.map(
								({ index }) => index
							)}
						/>
					))}
				{draconicAncestryTrait && (
					<DraconicAncestryChoiceSelector
						choice={
							draconicAncestryTrait.trait_specific
								?.subtrait_options as SrdSubtraitItemChoice
						}
						initialValue={raceInfo.draconicAncestry?.index}
						onApply={handleDraconicAncestryApply}
						onReset={handleDraconicAncestryReset}
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
								(trait.proficiency_choices?.from.options ?? [])[0].item.type
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
						/>
					))}
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
