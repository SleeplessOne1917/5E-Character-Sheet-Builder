import {
	AbilityItem,
	ClassLevel,
	MonsterSubtype,
	MonsterType,
	SrdFeatureItem,
	SrdFullClassItem,
	SrdProficiencyItem,
	SrdSubclassItem,
	Terrain
} from '../../../../types/srd';
import {
	addAbilityBonus,
	addFavoredEnemies,
	addFavoredTerrain,
	addFeatureProficiency,
	deselectSubclass,
	deselectSubclassSubtype,
	removeAbilityBonus,
	removeFavoredEnemies as removeFavoredEnemiesAction,
	removeFavoredTerrain,
	removeFeatureProficiency,
	removeFeatureSubfeature,
	selectSubclass,
	selectSubclassSubtype,
	setAbilityBonus,
	setFavoredEnemies,
	setFavoredTerrain,
	setLevel
} from '../../../../redux/features/classInfo';
import {
	addProficiency,
	removeProficiency
} from '../../../../redux/features/proficiencies';
import {
	decrementAbilityBonus,
	incrementAbilityBonus,
	resetAbilityHighest,
	setAbilityHighest,
	updateMiscBonus
} from '../../../../redux/features/abilityScores';
import { getProficienciesByType } from '../../../../graphql/srdClientService';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import { useCallback, useEffect, useState } from 'react';

import AbilityBonusSelector from '../AbilityBonusSelector/AbilityBonusSelector';
import AbilityScores from '../../../../types/abilityScores';
import Descriptor from '../../Descriptor/Descriptor';
import FavoredEnemySelector from '../FavoredEnemySelector/FavoredEnemySelector';
import FeatureChoiceSelector from '../FeatureChoiceSelector/FeatureChoiceSelector';
import Select from '../../../Select/Select';
import SubclassSelector from '../SubclassSelector/SubclassSelector';
import { getOrdinal } from '../../../../services/ordinalService';
import styles from './SelectedClassDisplay.module.css';
import FavoredTerrainSelector from '../FavoredTerrainSelector/FavoredTerrainSelector';
import LandSelector from '../LandSelector/LandSelector';

type SelectedClassDisplayProps = {
	klass: SrdFullClassItem;
	abilities: AbilityItem[];
	monsterTypes: { monsters: MonsterType[]; humanoids: MonsterSubtype[] };
};

const SelectedClassDisplay = ({
	klass,
	abilities,
	monsterTypes
}: SelectedClassDisplayProps) => {
	const dispatch = useAppDispatch();
	const classInfo = useAppSelector(state => state.editingCharacter.classInfo);
	const hasSpellcasting = !!klass.spellcasting;
	const hasCantrips = !!klass.class_levels[0].spellcasting?.cantrips_known;
	const hasSpellsKnown = klass.class_levels.some(
		level => level.spellcasting?.spells_known
	);

	const classLevels = [...klass.class_levels]
		.sort((a, b) => a.level - b.level)
		.filter(level => !level.subclass);

	const subclassFlavor = klass.subclasses[0].subclass_flavor;
	const subclassLevelNumbers = klass.subclasses[0].subclass_levels
		.map(sc => sc.level)
		.sort((a, b) => a - b);

	const spellCastingLevels: number[] = [];
	if (hasSpellcasting && klass.index !== 'warlock') {
		for (let i = 1; i <= 9; ++i) {
			if (
				/* eslint-disable @typescript-eslint/ban-ts-comment */
				// @ts-ignore
				klass.class_levels[0].spellcasting[`spell_slots_level_${i}`] !== null
				/* eslint-enable @typescript-eslint/ban-ts-comment */
			) {
				spellCastingLevels.push(i);
			} else {
				break;
			}
		}
	}

	const warlockSlots: { slotLevel: number; slots: number }[] = [];
	if (klass.index === 'warlock') {
		for (let i = 0; i < 20; ++i) {
			let slotLevel = 0;
			let slots = 0;

			for (let j = 1; j <= 9; ++j) {
				/* eslint-disable @typescript-eslint/ban-ts-comment */
				// @ts-ignore
				if (classLevels[i].spellcasting[`spell_slots_level_${j}`] > 0) {
					slotLevel = j;
					// @ts-ignore
					slots = classLevels[i].spellcasting[`spell_slots_level_${j}`];
					break;
				}
				/* eslint-enable @typescript-eslint/ban-ts-comment */
			}

			warlockSlots.push({ slotLevel, slots });
		}
	}

	const getColumnsForSpellCastersNotIncludingLevels = useCallback(() => {
		let columns = 3;
		if (klass.index === 'sorcerer') {
			++columns;
		}
		if (hasCantrips) {
			++columns;
		}
		if (hasSpellsKnown) {
			++columns;
		}

		return columns;
	}, [klass, hasCantrips, hasSpellsKnown]);

	const levelNumbers: number[] = [];
	for (let i = 1; i <= 20; ++i) {
		levelNumbers.push(i);
	}

	const handleAbilityScoreBonusChange = useCallback(
		(values: (AbilityScores | null)[], index: number) => {
			for (const abilityScoreIndex of classInfo.abilityBonuses[index]) {
				if (abilityScoreIndex !== null) {
					dispatch(decrementAbilityBonus(abilityScoreIndex));
				}
			}

			dispatch(setAbilityBonus({ index, abilityScores: values }));

			for (const abilityScoreIndex of values) {
				if (abilityScoreIndex !== null) {
					dispatch(incrementAbilityBonus(abilityScoreIndex));
				}
			}
		},
		[dispatch, classInfo.abilityBonuses]
	);

	const destroyUndeadTable = (
		<table className={styles.table}>
			<thead>
				<tr>
					<th>Cleric Level</th>
					<th>Destroys Undead of CR ...</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>5th</td>
					<td>1/2 or lower</td>
				</tr>
				<tr className={styles.odd}>
					<td>8th</td>
					<td>1 or lower</td>
				</tr>
				<tr>
					<td>11th</td>
					<td>2 or lower</td>
				</tr>
				<tr className={styles.odd}>
					<td>14th</td>
					<td>3 or lower</td>
				</tr>
				<tr>
					<td>17th</td>
					<td>4 or lower</td>
				</tr>
			</tbody>
		</table>
	);

	const wildShapeTable = (
		<table className={styles.table}>
			<thead>
				<tr>
					<th>Level</th>
					<th>Max CR</th>
					<th>Limitations</th>
					<th>Example</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>2nd</td>
					<td>1/4</td>
					<td>No flying or swimming speed</td>
					<td>Wolf</td>
				</tr>
				<tr className={styles.odd}>
					<td>4th</td>
					<td>1/2</td>
					<td>No flying speed</td>
					<td>Crocodile</td>
				</tr>
				<tr>
					<td>8th</td>
					<td>1</td>
					<td>&mdash;</td>
					<td>Giant eagle</td>
				</tr>
			</tbody>
		</table>
	);

	const creatingSpellSlotsTable = (
		<table className={styles.table}>
			<thead>
				<tr>
					<th>Spell Slot Level</th>
					<th>Sorcery Point Cost</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>1st</td>
					<td>2</td>
				</tr>
				<tr className={styles.odd}>
					<td>2nd</td>
					<td>3</td>
				</tr>
				<tr>
					<td>3rd</td>
					<td>5</td>
				</tr>
				<tr>
					<td>4th</td>
					<td>6</td>
				</tr>
				<tr>
					<td>5th</td>
					<td>7</td>
				</tr>
			</tbody>
		</table>
	);

	const getAllFeatures = useCallback(
		(
			classLevel: number,
			subclassIndex: string | null | undefined = classInfo?.subclass?.index
		) =>
			(
				classLevels as Partial<ClassLevel>[] &
					Pick<ClassLevel, 'level' | 'features'>[]
			)
				.concat(
					subclassIndex
						? klass.subclasses.find(sc => sc.index === subclassIndex)
								?.subclass_levels ?? []
						: []
				)
				.sort((a, b) => a.level - b.level)
				.filter(level => level.level <= classLevel)
				.flatMap(level => level.features),
		[classLevels, classInfo.subclass?.index, klass.subclasses]
	);

	const features = getAllFeatures(classInfo.level)
		.filter(
			feature =>
				!(
					feature.name
						.toLocaleLowerCase()
						.includes('ability score improvement') ||
					feature.name === subclassFlavor
				)
		)
		.reduce((acc: SrdFeatureItem[], cur) => {
			const feature = {
				...cur,
				name: cur.name
					.replace(/\s*\(.*\)/, '')
					.replace(/Spellcasting:.*/i, 'Spellcasting')
			};
			if (!acc.some(f => f.name === feature.name)) {
				return [...acc, feature];
			} else {
				return acc;
			}
		}, []);

	const selectedProficiencies = useAppSelector(
		state => state.editingCharacter.proficiencies
	);

	const [allSavingThrowProficiencies, setAllSavingThrowProficiencies] =
		useState<SrdProficiencyItem[]>();

	useEffect(() => {
		if (klass.index === 'monk') {
			getProficienciesByType('SAVING_THROWS').then(result => {
				setAllSavingThrowProficiencies(result.data?.proficiencies ?? []);
			});
		}
	}, [setAllSavingThrowProficiencies, klass.index]);

	const removeAbilityScoreBonuses = useCallback(
		(newLevel: number) => {
			const numAbilityScoreBonuses =
				classLevels[newLevel - 1].ability_score_bonuses;

			if (numAbilityScoreBonuses < classInfo.abilityBonuses.length) {
				for (
					let i = 0;
					i < classInfo.abilityBonuses.length - numAbilityScoreBonuses;
					++i
				) {
					const lastImprovement =
						classInfo.abilityBonuses[classInfo.abilityBonuses.length - (i + 1)];

					lastImprovement.forEach(improvement => {
						if (improvement !== null) {
							dispatch(decrementAbilityBonus(improvement));
						}
					});

					dispatch(removeAbilityBonus());
				}
			}
		},
		[dispatch, classLevels, classInfo.abilityBonuses]
	);

	const addBlankAbilityScoreBonuses = useCallback(
		(newLevel: number) => {
			const numAbilityScoreBonuses =
				classLevels[newLevel - 1].ability_score_bonuses;

			if (numAbilityScoreBonuses > classInfo.abilityBonuses.length) {
				for (
					let i = 0;
					i < numAbilityScoreBonuses - classInfo.abilityBonuses.length;
					++i
				) {
					dispatch(addAbilityBonus([null, null]));
				}
			}
		},
		[dispatch, classInfo.abilityBonuses.length, classLevels]
	);

	const addPrimalChampion = useCallback(
		(newLevel: number) => {
			if (
				classInfo.level < 20 &&
				newLevel === 20 &&
				klass.index === 'barbarian'
			) {
				dispatch(setAbilityHighest({ abilityIndex: 'con', value: 24 }));
				dispatch(setAbilityHighest({ abilityIndex: 'str', value: 24 }));

				dispatch(updateMiscBonus({ abilityIndex: 'con', value: 4 }));
				dispatch(updateMiscBonus({ abilityIndex: 'str', value: 4 }));
			}
		},
		[dispatch, classInfo.level, klass.index]
	);

	const removePrimalChampion = useCallback(
		(newLevel: number) => {
			if (
				newLevel < 20 &&
				classInfo.level === 20 &&
				klass.index === 'barbarian'
			) {
				dispatch(resetAbilityHighest('con'));
				dispatch(resetAbilityHighest('str'));

				dispatch(updateMiscBonus({ abilityIndex: 'con', value: null }));
				dispatch(updateMiscBonus({ abilityIndex: 'str', value: null }));
			}
		},
		[dispatch, classInfo.level, klass.index]
	);

	const addDiamondSoul = useCallback(
		(newLevel: number) => {
			if (klass.index === 'monk') {
				if (
					newLevel >= 14 &&
					allSavingThrowProficiencies?.some(
						st => !selectedProficiencies.some(p => p.index === st.index)
					)
				) {
					for (const prof of allSavingThrowProficiencies.filter(
						st => !klass.proficiencies.some(p => p.index === st.index)
					)) {
						dispatch(
							addFeatureProficiency({
								index: 'diamond-soul',
								proficiency: prof
							})
						);
						dispatch(addProficiency(prof));
					}
				}
			}
		},
		[
			dispatch,
			allSavingThrowProficiencies,
			klass.index,
			klass.proficiencies,
			selectedProficiencies
		]
	);

	const fightingStyles = features.filter(({ index }) =>
		index.includes('fighting-style')
	);

	const removeFightingStyles = useCallback(
		(newLevel: number, subclassIndex?: string | null) => {
			if (fightingStyles.length > 0) {
				const newLevelFightingStyles = getAllFeatures(
					newLevel,
					subclassIndex
				).filter(({ index }) => index.includes('fighting-style'));

				if (
					newLevelFightingStyles.length <
					(classInfo.featuresSubfeatures[fightingStyles[0].index]?.length ?? 0)
				) {
					const theFeatures =
						classInfo.featuresSubfeatures[fightingStyles[0].index];
					for (
						let i = 0;
						i < theFeatures.length - newLevelFightingStyles.length;
						++i
					) {
						dispatch(
							removeFeatureSubfeature({
								index: fightingStyles[0].index,
								feature: theFeatures[theFeatures.length - (i + 1)].index
							})
						);
					}
				}
			}
		},
		[dispatch, classInfo.featuresSubfeatures, getAllFeatures, fightingStyles]
	);

	const eldritchInvocation = features.find(({ index }) =>
		index.includes('eldritch-invocations')
	);

	const removeInvocations = useCallback(
		(newLevel: number) => {
			const invocationsKnown =
				classLevels[newLevel - 1].class_specific?.invocations_known ?? 0;
			if (
				eldritchInvocation &&
				classInfo.featuresSubfeatures[eldritchInvocation.index] &&
				classInfo.featuresSubfeatures[eldritchInvocation.index].length >
					invocationsKnown
			) {
				const invocations =
					classInfo.featuresSubfeatures[eldritchInvocation.index];
				for (let i = 0; i < invocations.length - invocationsKnown; ++i) {
					dispatch(
						removeFeatureSubfeature({
							index: eldritchInvocation.index,
							feature: invocations[invocations.length - (i + 1)].index
						})
					);
				}
			}
		},
		[dispatch, classInfo.featuresSubfeatures, classLevels, eldritchInvocation]
	);

	const removeFeatureProficiencies = useCallback(
		(newLevel: number) => {
			for (const featureKey of Object.keys(classInfo.featuresProficiencies)) {
				if (!getAllFeatures(newLevel).some(f => f.index === featureKey)) {
					for (const { index } of classInfo.featuresProficiencies[featureKey]) {
						dispatch(
							removeFeatureProficiency({
								index: featureKey,
								proficiency: index
							})
						);

						dispatch(removeProficiency(index));
					}
				}
			}
		},
		[classInfo.featuresProficiencies, dispatch, getAllFeatures]
	);

	const getFavoredEnemy = useCallback(
		(level: number) =>
			getAllFeatures(level).reduce<SrdFeatureItem | null>((acc, cur) => {
				if (/Favored Enemy/i.test(cur.name)) {
					return cur;
				} else {
					return acc;
				}
			}, null),
		[getAllFeatures]
	);

	const getFavoredNumber = useCallback(
		(favored?: SrdFeatureItem | null) =>
			favored
				? parseInt(
						(/.*\((\d).*\)/i.exec(favored.name) as RegExpExecArray)[1],
						10
				  )
				: 0,
		[]
	);

	const getNaturalExplorer = useCallback(
		(level: number) =>
			getAllFeatures(level).reduce<SrdFeatureItem | null>((acc, cur) => {
				if (/Natural Explorer/i.test(cur.name)) {
					return cur;
				} else {
					return acc;
				}
			}, null),
		[getAllFeatures]
	);

	const removeFavoredEnemies = useCallback(
		(newLevel: number) => {
			const oldFavoredEnemy = getFavoredEnemy(classInfo.level);
			const newFavoredEnemy = getFavoredEnemy(newLevel);

			const oldFavoredEnemiesNumber = getFavoredNumber(oldFavoredEnemy);

			const newFavoredEnemiesNumber = getFavoredNumber(newFavoredEnemy);

			if (newFavoredEnemiesNumber < oldFavoredEnemiesNumber) {
				for (
					let i = 0;
					i < oldFavoredEnemiesNumber - newFavoredEnemiesNumber;
					++i
				) {
					dispatch(removeFavoredEnemiesAction());
				}
			}
		},
		[dispatch, classInfo.level, getFavoredEnemy, getFavoredNumber]
	);

	const addBlankFavoredEnemies = useCallback(
		(newLevel: number) => {
			const oldFavoredEnemy = getFavoredEnemy(classInfo.level);

			const newFavoredEnemy = getFavoredEnemy(newLevel);

			const oldFavoredEnemiesNumber = getFavoredNumber(oldFavoredEnemy);

			const newFavoredEnemiesNumber = getFavoredNumber(newFavoredEnemy);

			if (newFavoredEnemiesNumber > oldFavoredEnemiesNumber) {
				for (
					let i = 0;
					i < newFavoredEnemiesNumber - oldFavoredEnemiesNumber;
					++i
				) {
					dispatch(addFavoredEnemies([null]));
				}
			}
		},
		[dispatch, classInfo.level, getFavoredEnemy, getFavoredNumber]
	);

	const removeFavoredTerrains = useCallback(
		(newLevel: number) => {
			const oldFavoredTerrain = getNaturalExplorer(classInfo.level);
			const newFavoredTerrain = getNaturalExplorer(newLevel);

			const oldFavoredTerrainsNumber = getFavoredNumber(oldFavoredTerrain);

			const newFavoredTerrainsNumber = getFavoredNumber(newFavoredTerrain);

			if (newFavoredTerrainsNumber < oldFavoredTerrainsNumber) {
				for (
					let i = 0;
					i < oldFavoredTerrainsNumber - newFavoredTerrainsNumber;
					++i
				) {
					dispatch(removeFavoredTerrain());
				}
			}
		},
		[dispatch, classInfo.level, getNaturalExplorer, getFavoredNumber]
	);

	const addBlankFavoredTerrains = useCallback(
		(newLevel: number) => {
			const oldFavoredTerrain = getNaturalExplorer(classInfo.level);

			const newFavoredTerrain = getNaturalExplorer(newLevel);

			const oldFavoredTerrainsNumber = getFavoredNumber(oldFavoredTerrain);

			const newFavoredTerrainsNumber = getFavoredNumber(newFavoredTerrain);

			if (newFavoredTerrainsNumber > oldFavoredTerrainsNumber) {
				for (
					let i = 0;
					i < newFavoredTerrainsNumber - oldFavoredTerrainsNumber;
					++i
				) {
					dispatch(addFavoredTerrain(null));
				}
			}
		},
		[dispatch, classInfo.level, getNaturalExplorer, getFavoredNumber]
	);

	const [subclassFeaturesWithSubfeatures, setSubclassFeaturesWithSubfeatures] =
		useState<SrdFeatureItem[]>([]);

	const addBlankSubclassFeatures = useCallback(
		(
			newLevel: number,
			subclass: SrdSubclassItem | null | undefined = classInfo.subclass
		) => {
			for (const feature of [...(subclass?.subclass_levels ?? [])]
				.sort((a, b) => a.level - b.level)
				.filter(({ level }) => level <= newLevel)
				.flatMap(({ features }) => features)) {
				if (
					feature.feature_specific?.subfeature_options &&
					!subclassFeaturesWithSubfeatures.some(f => f.index === feature.index)
				) {
					setSubclassFeaturesWithSubfeatures(prev => [...prev, feature]);
				}
			}
		},
		[
			setSubclassFeaturesWithSubfeatures,
			classInfo.subclass,
			subclassFeaturesWithSubfeatures
		]
	);

	const removeSubclassFeatures = useCallback(
		(
			newLevel: number,
			subclass: SrdSubclassItem | null | undefined = classInfo.subclass
		) => {
			const newNumberOfSubclassFeaturesWithSubfeatures =
				[...(subclass?.subclass_levels ?? [])]
					.sort((a, b) => a.level - b.level)
					.filter(({ level }) => level <= newLevel)
					.flatMap(({ features }) => features)
					.filter(feature => feature.feature_specific?.subfeature_options)
					.length ?? 0;
			const currentNumberofSubclassFeaturesWithSubfeatures =
				subclassFeaturesWithSubfeatures.length;

			if (
				newNumberOfSubclassFeaturesWithSubfeatures <
				currentNumberofSubclassFeaturesWithSubfeatures
			) {
				for (
					let i = 0;
					i <
					currentNumberofSubclassFeaturesWithSubfeatures -
						newNumberOfSubclassFeaturesWithSubfeatures;
					++i
				) {
					const featureIdex =
						subclassFeaturesWithSubfeatures[
							subclassFeaturesWithSubfeatures.length - (i + 1)
						].index;
					const featureSubfeatures = classInfo.featuresSubfeatures[featureIdex];

					if (featureSubfeatures) {
						for (let j = 0; j < featureSubfeatures.length; ++j) {
							dispatch(
								removeFeatureSubfeature({
									index: featureIdex,
									feature:
										featureSubfeatures[featureSubfeatures.length - (j + 1)]
											.index
								})
							);
						}
					}

					setSubclassFeaturesWithSubfeatures(prev =>
						prev.filter((_, index) => index < prev.length - 1)
					);
				}
			}
		},
		[
			dispatch,
			classInfo.featuresSubfeatures,
			classInfo.subclass,
			subclassFeaturesWithSubfeatures
		]
	);

	const handleLevelChange = useCallback(
		(newValue: number) => {
			if (newValue < classInfo.level) {
				removeFeatureProficiencies(newValue);
				removeFavoredEnemies(newValue);
				removeInvocations(newValue);
				removeFightingStyles(newValue);
				removeFavoredTerrains(newValue);
				removeAbilityScoreBonuses(newValue);
				removePrimalChampion(newValue);
				removeSubclassFeatures(newValue);
			}

			if (newValue > classInfo.level) {
				addBlankFavoredEnemies(newValue);
				addDiamondSoul(newValue);
				addBlankFavoredTerrains(newValue);
				addBlankAbilityScoreBonuses(newValue);
				addPrimalChampion(newValue);
				addBlankSubclassFeatures(newValue);
			}

			dispatch(setLevel(newValue));
		},
		[
			dispatch,
			removeFeatureProficiencies,
			classInfo.level,
			removeFavoredEnemies,
			addBlankFavoredEnemies,
			removeInvocations,
			removeFightingStyles,
			addDiamondSoul,
			removeFavoredTerrains,
			addBlankFavoredTerrains,
			addBlankAbilityScoreBonuses,
			removeAbilityScoreBonuses,
			addPrimalChampion,
			removePrimalChampion,
			removeSubclassFeatures,
			addBlankSubclassFeatures
		]
	);

	const handleSubclassSelect = useCallback(
		(subclass: SrdSubclassItem) => {
			dispatch(selectSubclass(subclass));
			addBlankSubclassFeatures(classInfo.level, subclass);
			removeFightingStyles(classInfo.level, subclass.index);
		},
		[dispatch, removeFightingStyles, classInfo.level, addBlankSubclassFeatures]
	);

	const handleSubclassDeselect = useCallback(() => {
		dispatch(deselectSubclassSubtype());
		removeSubclassFeatures(classInfo.level, null);
		dispatch(deselectSubclass());
		removeFightingStyles(classInfo.level, null);
	}, [dispatch, removeFightingStyles, classInfo.level, removeSubclassFeatures]);

	const handleSelectSubclassSubtype = useCallback(
		(value: string | null) => {
			if (value) {
				dispatch(selectSubclassSubtype(value));
			} else {
				dispatch(deselectSubclassSubtype());
			}
		},
		[dispatch]
	);

	const handleFavoredEnemyChange = useCallback(
		(index: number, values: (MonsterType | MonsterSubtype | null)[]) => {
			dispatch(setFavoredEnemies({ index, enemyTypes: values }));
		},
		[dispatch]
	);

	const handleFavoredTerrainChange = useCallback(
		(index: number, value: Terrain | null) => {
			dispatch(setFavoredTerrain({ index, terrain: value }));
		},
		[dispatch]
	);

	const favoredEnemies = useAppSelector(
		state => state.editingCharacter.classInfo.favoredEnemies
	);

	const favoredTerrains = useAppSelector(
		state => state.editingCharacter.classInfo.favoredTerrains
	);

	return (
		<div className={styles.container}>
			<div className={styles.summary}>
				<div>
					<div className={styles['summary-item-label']}>Hit Die</div>
					<div className={styles['summary-item-data']}>d{klass.hit_die}</div>
				</div>
				<div>
					<div className={styles['summary-item-label']}>Saving Throws</div>
					<div className={styles['summary-item-data']}>
						{klass.saving_throws.map(st => st.full_name).join(' and ')}
					</div>
				</div>
				{klass.spellcasting && (
					<div>
						<div className={styles['summary-item-label']}>
							Spellcasting Ability
						</div>
						<div className={styles['summary-item-data']}>
							{klass.spellcasting.spellcasting_ability.full_name}
						</div>
					</div>
				)}
			</div>
			<svg>
				<use xlinkHref={`/Icons.svg#${klass.index}`} />
			</svg>
			<h2 className={styles.heading}>Levels</h2>
			<div className={styles['table-container']}>
				<div className={styles['level-select-container']}>
					<label className={styles['level-select-label']} id="select-level">
						Select Level
					</label>
					<Select
						labelledBy="select-level"
						onChange={value => handleLevelChange(value as number)}
						options={levelNumbers.map(num => ({ value: num, label: `${num}` }))}
						value={classInfo.level}
					/>
				</div>
				<table className={styles.table}>
					<thead>
						{spellCastingLevels.length > 0 && (
							<tr>
								<th colSpan={getColumnsForSpellCastersNotIncludingLevels()}>
									&nbsp;
								</th>
								<th
									colSpan={spellCastingLevels.length}
									style={{ textAlign: 'center' }}
								>
									&mdash;Spell Slots per Spell Level&mdash;
								</th>
							</tr>
						)}
						<tr>
							<th>Level</th>
							<th>Proficiency Bonus</th>
							{klass.index === 'monk' && (
								<>
									<th>Martial Arts</th>
									<th>Ki Points</th>
									<th>Unarmored Movement</th>
								</>
							)}
							{klass.index === 'rogue' && <th>Sneak Attack</th>}
							{klass.index === 'sorcerer' && <th>Sorcery Points</th>}
							<th>Features</th>
							{klass.index === 'barbarian' && (
								<>
									<th>Rages</th>
									<th>Rage Damage</th>
								</>
							)}
							{hasSpellcasting && (
								<>
									{hasCantrips && <th>Cantrips Known</th>}
									{hasSpellsKnown && <th>Spells Known</th>}
									{spellCastingLevels.map(level => (
										<th key={level}>{getOrdinal(level)}</th>
									))}
									{klass.index === 'warlock' && (
										<>
											<th>Spell Slots</th>
											<th>Slot Level</th>
											<th>Invocations Known</th>
										</>
									)}
								</>
							)}
						</tr>
					</thead>
					<tbody>
						{classLevels.map(
							(
								{ level, prof_bonus, features, spellcasting, class_specific },
								index
							) => {
								const featureNames = features
									.filter(
										f =>
											level === 2 || !f.index.includes('eldritch-invocations')
									)
									.map(({ name }) => {
										let nameToReturn = name.replace(
											/Spellcasting:.*/i,
											'Spellcasting'
										);

										if (name.toLowerCase().includes('wild shape')) {
											if (level === 2) {
												nameToReturn = 'Wild Shape';
											} else {
												nameToReturn = 'Wild Shape improvement';
											}
										}

										return nameToReturn;
									});

								if (!featureNames.includes(subclassFlavor)) {
									if (subclassLevelNumbers[0] === level) {
										featureNames.push(subclassFlavor);
									} else if (subclassLevelNumbers.includes(level)) {
										featureNames.push(`${subclassFlavor} feature`);
									}
								}

								return (
									<tr
										key={`${klass.index}-${level}`}
										className={`${index % 2 === 1 ? styles.odd : ''} ${
											level === classInfo.level
												? styles['current-level-row']
												: ''
										}`}
									>
										<td>{getOrdinal(level)}</td>
										<td>+{prof_bonus}</td>
										{klass.index === 'monk' && (
											<>
												<td>
													{class_specific?.martial_arts?.dice_count}d
													{class_specific?.martial_arts?.dice_value}
												</td>
												<td>
													{(class_specific?.ki_points ?? 0) > 0
														? class_specific?.ki_points
														: '\u2014'}
												</td>
												<td>
													{(class_specific?.unarmored_movement ?? 0) > 0
														? `+${class_specific?.unarmored_movement} ft.`
														: '\u2014'}
												</td>
											</>
										)}
										{klass.index === 'rogue' && (
											<td>
												{class_specific?.sneak_attack?.dice_count}d
												{class_specific?.sneak_attack?.dice_value}
											</td>
										)}
										{klass.index === 'sorcerer' && (
											<td>
												{(class_specific?.sorcery_points ?? 0) > 0
													? class_specific?.sorcery_points
													: '\u2014'}
											</td>
										)}
										<td>
											{featureNames.length > 0
												? featureNames.join(', ')
												: '\u2014'}
										</td>
										{klass.index === 'barbarian' && (
											<>
												<td>
													{level === 20
														? 'Unlimited'
														: class_specific?.rage_count}
												</td>
												<td>{`+${class_specific?.rage_damage_bonus}`}</td>
											</>
										)}
										{hasSpellcasting && (
											<>
												{hasCantrips && <td>{spellcasting?.cantrips_known}</td>}
												{hasSpellsKnown && (
													<td>{spellcasting?.spells_known}</td>
												)}
												{spellCastingLevels.map(level => (
													<td key={level}>
														{
															/* eslint-disable @typescript-eslint/ban-ts-comment */
															// @ts-ignore
															spellcasting[`spell_slots_level_${level}`]
															/* eslint-enable @typescript-eslint/ban-ts-comment */
														}
													</td>
												))}
												{klass.index === 'warlock' && (
													<>
														<td>{warlockSlots[index].slots}</td>
														<td>{getOrdinal(warlockSlots[index].slotLevel)}</td>
														<td>
															{(class_specific?.invocations_known ?? 0) > 0
																? class_specific?.invocations_known
																: '\u2014'}
														</td>
													</>
												)}
											</>
										)}
									</tr>
								);
							}
						)}
					</tbody>
				</table>
			</div>
			{classInfo.abilityBonuses.length > 0 && (
				<>
					<h2 className={styles.heading}>
						Ability Score Improvement
						{classInfo.abilityBonuses.length > 1 ? 's' : ''}
					</h2>
					<div className={styles['ability-bonus-container']}>
						{classInfo.abilityBonuses.map((bonus, index) => (
							<AbilityBonusSelector
								key={index}
								values={bonus}
								abilities={abilities}
								onChange={values =>
									handleAbilityScoreBonusChange(values, index)
								}
							/>
						))}
					</div>
				</>
			)}
			{classInfo.level >= subclassLevelNumbers[0] && (
				<>
					<h2 className={styles.heading}>{subclassFlavor}</h2>
					<div className={styles['subclass-container']}>
						{klass.subclasses.map(sc => (
							<SubclassSelector
								key={sc.index}
								subclass={sc}
								selected={
									classInfo.subclass && classInfo.subclass.index === sc.index
								}
								onSelect={() => handleSubclassSelect(sc)}
								onDeselect={handleSubclassDeselect}
								klassName={klass.name}
							/>
						))}
					</div>
				</>
			)}
			{eldritchInvocation && (
				<FeatureChoiceSelector
					feature={eldritchInvocation}
					choose={
						classLevels[classInfo.level - 1].class_specific
							?.invocations_known ?? 0
					}
					subfeatures={
						eldritchInvocation.feature_specific?.subfeature_options.from.options.map(
							({ item }) => ({
								...item,
								name: item.name.replace(/Eldritch Invocation:\s+/i, '')
							})
						) as SrdFeatureItem[]
					}
				/>
			)}
			{favoredEnemies && favoredEnemies.length > 0 && (
				<>
					<h2 className={styles.heading}>
						Favored Enem{favoredEnemies.length === 1 ? 'y' : 'ies'}
					</h2>
					<div className={styles['favored-enemy-container']}>
						{favoredEnemies.map((e, index) => (
							<FavoredEnemySelector
								monsters={monsterTypes}
								key={index}
								onChange={values => handleFavoredEnemyChange(index, values)}
								values={e}
							/>
						))}
					</div>
				</>
			)}
			{favoredTerrains && favoredTerrains.length > 0 && (
				<>
					<h2 className={styles.heading}>Natural Explorer</h2>
					<div className={styles['favored-terrain-container']}>
						{favoredTerrains.map((t, index) => (
							<FavoredTerrainSelector
								key={index}
								value={t}
								onChange={value => handleFavoredTerrainChange(index, value)}
							/>
						))}
					</div>
				</>
			)}
			{subclassFeaturesWithSubfeatures.length > 0 &&
				subclassFeaturesWithSubfeatures.map(feature => (
					<FeatureChoiceSelector
						key={feature.index}
						feature={feature}
						choose={feature.feature_specific?.subfeature_options?.choose ?? 0}
						subfeatures={
							feature.feature_specific?.subfeature_options?.from.options.map(
								({ item }) => ({
									...item,
									name: item.name.replace(/.*:\s*/, '')
								})
							) as SrdFeatureItem[]
						}
					/>
				))}
			{classInfo.subclass?.index === 'land' && (
				<>
					<h2 className={styles.heading}>{classInfo.subclass.name}</h2>
					<LandSelector
						value={(classInfo.subclassSubType as Land) ?? null}
						onChange={handleSelectSubclassSubtype}
					/>
				</>
			)}
			{fightingStyles.length > 0 && (
				<FeatureChoiceSelector
					feature={fightingStyles[0]}
					choose={fightingStyles.reduce<number>(
						(acc, cur) =>
							acc + (cur.feature_specific?.subfeature_options.choose ?? 0),
						0
					)}
					subfeatures={
						fightingStyles[0].feature_specific?.subfeature_options.from.options.map(
							({ item }) => ({
								...item,
								name: item.name.replace(/Fighting Style:\s*/i, '')
							})
						) as SrdFeatureItem[]
					}
				/>
			)}
			<h2 className={styles.heading}>Features</h2>
			{features.map(feature => (
				<Descriptor
					key={feature.index}
					description={feature.desc}
					title={feature.name}
					table={
						/Destroy Undead/i.test(feature.name)
							? destroyUndeadTable
							: /Wild Shape/i.test(feature.name)
							? wildShapeTable
							: /Creating Spell Slots/i.test(feature.name)
							? creatingSpellSlotsTable
							: null
					}
				/>
			))}
		</div>
	);
};

export default SelectedClassDisplay;
