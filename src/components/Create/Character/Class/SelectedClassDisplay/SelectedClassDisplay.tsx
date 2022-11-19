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
} from '../../../../../types/srd';
import {
	AbilityScore,
	decrementAbilityBonus,
	incrementAbilityBonus,
	resetAbilityHighest,
	setAbilityHighest,
	updateMiscBonus
} from '../../../../../redux/features/abilityScores';
import {
	addAbilityBonus,
	addExpertiseProficiency,
	addFavoredEnemies,
	addFavoredTerrain,
	addFeatureProficiency,
	addSubclassSpell,
	deselectSubclass,
	deselectSubclassSubtype,
	removeAbilityBonus,
	removeClassSpell,
	removeExpertiseProficiency,
	removeFavoredEnemies as removeFavoredEnemiesAction,
	removeFavoredTerrain,
	removeFeatureProficiency,
	removeFeatureSubfeature,
	removeSubclassSpell,
	selectSubclass,
	selectSubclassSubtype,
	setAbilityBonus,
	setFavoredEnemies,
	setFavoredTerrain,
	setLevel
} from '../../../../../redux/features/classInfo';
import {
	addLevelHPBonus,
	removeLevelHPBonus
} from '../../../../../redux/features/hp';
import {
	addProficiency,
	removeProficiency
} from '../../../../../redux/features/proficiencies';
import {
	addSpell,
	removeSpell,
	setCantripsKnown,
	setHighestSlotLevel,
	setSpellsKnown
} from '../../../../../redux/features/spellcasting';
import {
	useAppDispatch,
	useAppSelector
} from '../../../../../hooks/reduxHooks';
import { useCallback, useEffect, useState } from 'react';

import AbilityBonusSelector from '../AbilityBonusSelector/AbilityBonusSelector';
import AbilityScores from '../../../../../types/abilityScores';
import Descriptor from '../../Descriptor/Descriptor';
import ExpertiseSelector from '../ExpertiseSelector/ExpertiseSelector';
import FavoredEnemySelector from '../FavoredEnemySelector/FavoredEnemySelector';
import FavoredTerrainSelector from '../FavoredTerrainSelector/FavoredTerrainSelector';
import FeatureChoiceSelector from '../FeatureChoiceSelector/FeatureChoiceSelector';
import { Land } from '../../../../../types/land';
import LandSelector from '../LandSelector/LandSelector';
import ProficienciesSelector from '../ProficienciesSelector/ProficienciesSelector';
import Select from '../../../../Select/Select/Select';
import SubclassSelector from '../SubclassSelector/SubclassSelector';
import { getOrdinal } from '../../../../../services/ordinalService';
import { getProficienciesByType } from '../../../../../graphql/srdClientService';
import { mapSpellItem } from '../../../../../services/spellsService';
import { rollDie } from '../../../../../services/diceService';
import styles from './SelectedClassDisplay.module.css';
import usePreparedSpells from '../../../../../hooks/usePreparedSpells';

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
	const { getNumberOfSpellsToPrepare, shouldPrepareSpells } =
		usePreparedSpells();
	const classSpells = useAppSelector(
		state => state.editingCharacter.classInfo.spells
	)?.filter(({ level }) => level > 0);
	const classCantrips = useAppSelector(
		state => state.editingCharacter.classInfo.spells
	)?.filter(({ level }) => level === 0);
	const spellcastingAbility = useAppSelector(
		state =>
			state.editingCharacter.classInfo.class?.spellcasting?.spellcasting_ability
				.index
	);
	const abilityScores = useAppSelector(
		state => state.editingCharacter.abilityScores
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

	const removePrepareSpellsAbilityBonusChange = useCallback(
		(abilityScoreIndex: AbilityScores, decrementValue = 1) => {
			if (
				spellcastingAbility &&
				abilityScoreIndex === spellcastingAbility &&
				shouldPrepareSpells
			) {
				const abilityScore = (
					abilityScores as {
						[key: string]: AbilityScore;
					}
				)[abilityScoreIndex];

				const newPreparedSpellsNumber = getNumberOfSpellsToPrepare({
					abilityScore: {
						...abilityScore,
						abilityImprovement: abilityScore.abilityImprovement - decrementValue
					}
				});

				if (classSpells && newPreparedSpellsNumber < classSpells.length) {
					for (
						let i = 0;
						i < classSpells.length - newPreparedSpellsNumber;
						++i
					) {
						const spellToRemove = classSpells[classSpells.length - (i + 1)];

						dispatch(removeSpell(spellToRemove.id));
						dispatch(removeClassSpell(spellToRemove.id));
					}
				}
			}
		},
		[
			abilityScores,
			dispatch,
			classSpells,
			getNumberOfSpellsToPrepare,
			shouldPrepareSpells,
			spellcastingAbility
		]
	);

	const abilityBonusesAreSame = useCallback(
		(abilityBonuses: (AbilityScores | null)[]) =>
			abilityBonuses.reduce<{
				bonuses: (AbilityScores | null)[];
				areSame: boolean;
			}>(
				(acc, cur) => ({
					bonuses: [...acc.bonuses, cur],
					areSame: acc.bonuses.length === 0 || acc.bonuses.includes(cur)
				}),
				{
					bonuses: [],
					areSame: true
				}
			).areSame,
		[]
	);

	const handleAbilityScoreBonusChange = useCallback(
		(values: (AbilityScores | null)[], index: number) => {
			const oldBonuses = classInfo.abilityBonuses[index];
			const oldBonusesAreSame = abilityBonusesAreSame(oldBonuses);
			const newBonusesAreSame = abilityBonusesAreSame(values);

			if (
				!newBonusesAreSame &&
				values.some(b => oldBonuses.includes(b)) &&
				oldBonusesAreSame &&
				oldBonuses[0]
			) {
				removePrepareSpellsAbilityBonusChange(oldBonuses[0]);
			} else if (
				newBonusesAreSame &&
				oldBonusesAreSame &&
				oldBonuses[0] &&
				oldBonuses[0] !== values[0]
			) {
				removePrepareSpellsAbilityBonusChange(oldBonuses[0], 2);
			} else {
				for (const bonus of oldBonuses.filter(
					b => !values.some(v => b === v)
				)) {
					if (bonus) {
						removePrepareSpellsAbilityBonusChange(bonus);
					}
				}
			}

			for (const abilityScoreIndex of oldBonuses) {
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
		[
			dispatch,
			classInfo.abilityBonuses,
			removePrepareSpellsAbilityBonusChange,
			abilityBonusesAreSame
		]
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
		if (klass.index === 'monk' || klass.index === 'rogue') {
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

					dispatch(removeAbilityBonus(undefined));
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

	const addSlipperyMind = useCallback(
		(newLevel: number) => {
			if (
				klass.index === 'rogue' &&
				newLevel >= 15 &&
				!selectedProficiencies.some(prof => prof.index.includes('wis'))
			) {
				const savingThrow = allSavingThrowProficiencies?.find(st =>
					st.index.includes('wis')
				) as SrdProficiencyItem;

				dispatch(
					addFeatureProficiency({
						index: 'slippery-mind',
						proficiency: savingThrow
					})
				);
				dispatch(addProficiency(savingThrow));
			}
		},
		[dispatch, allSavingThrowProficiencies, klass.index, selectedProficiencies]
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
					dispatch(removeFavoredEnemiesAction(undefined));
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
					dispatch(removeFavoredTerrain(undefined));
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

	const addMoreExpertise = useCallback(
		(newLevel: number) => {
			if (
				klass.index === 'rogue' &&
				newLevel >= 6 &&
				(classInfo.expertiseProficiencies?.length ?? 0) < 4
			) {
				for (let i = 0; i < 2; ++i) {
					dispatch(addExpertiseProficiency(null));
				}
			}
		},
		[dispatch, classInfo.expertiseProficiencies, klass.index]
	);

	const removeExpertise = useCallback(
		(newLevel: number) => {
			if (
				klass.index === 'rogue' &&
				newLevel < 6 &&
				(classInfo.expertiseProficiencies?.length ?? 0) > 2
			) {
				for (let i = 0; i < 2; ++i) {
					dispatch(removeExpertiseProficiency(undefined));
				}
			}
		},
		[dispatch, classInfo.expertiseProficiencies, klass.index]
	);

	const removeMetamagic = useCallback(
		(newLevel: number) => {
			const newNumberOfMetamagics =
				classLevels[newLevel - 1].class_specific?.metamagic_known ?? 0;
			const metamagicIndex = features.find(f =>
				f.index.includes('metamagic')
			)?.index;
			const metamagics = metamagicIndex
				? classInfo.featuresSubfeatures[metamagicIndex] ?? []
				: [];

			if (newNumberOfMetamagics < metamagics.length) {
				for (let i = 0; i < metamagics.length - newNumberOfMetamagics; ++i) {
					const metamagicToRemove = metamagics[metamagics.length - (i + 1)];

					dispatch(
						removeFeatureSubfeature({
							index: metamagicIndex as string,
							feature: metamagicToRemove.index
						})
					);
				}
			}
		},
		[dispatch, classLevels, classInfo.featuresSubfeatures, features]
	);

	const characterSpellcasting = useAppSelector(
		state => state.editingCharacter.spellcasting
	);

	const handleSpellcastingChange = useCallback(
		(newLevel: number) => {
			const levelSpellcasting = classLevels[newLevel - 1].spellcasting;
			const highestSlotLevel = Object.keys(levelSpellcasting ?? {}).reduce(
				(acc, cur) => {
					if (cur.includes('spell_slots_level')) {
						if (
							levelSpellcasting &&
							(levelSpellcasting as { [key: string]: number })[cur] &&
							((levelSpellcasting as { [key: string]: number })[
								cur
							] as number) > 0
						) {
							const slotLevel = parseInt(
								(/spell_slots_level_(\d)/.exec(cur) as RegExpExecArray)[1],
								10
							);

							return slotLevel > acc ? slotLevel : acc;
						}
					}

					return acc;
				},
				0
			);

			if (highestSlotLevel !== characterSpellcasting.highestSlotLevel) {
				dispatch(setHighestSlotLevel(highestSlotLevel));

				if (highestSlotLevel < characterSpellcasting.highestSlotLevel) {
					for (const spell of (classSpells ?? []).filter(
						s => s.level > highestSlotLevel
					)) {
						dispatch(removeSpell(spell.id));
						dispatch(removeClassSpell(spell.id));
					}
				}
			}

			if (
				typeof levelSpellcasting?.spells_known === 'number' &&
				levelSpellcasting.spells_known !== characterSpellcasting.spellsKnown
			) {
				dispatch(setSpellsKnown(levelSpellcasting.spells_known));

				if (
					classSpells &&
					levelSpellcasting.spells_known < classSpells.length
				) {
					for (
						let i = 0;
						i < classSpells.length - levelSpellcasting.spells_known;
						++i
					) {
						const spellToRemove = classSpells[classSpells.length - (i + 1)];
						dispatch(removeSpell(spellToRemove.id));
						dispatch(removeClassSpell(spellToRemove.id));
					}
				}
			}

			if (
				typeof levelSpellcasting?.cantrips_known === 'number' &&
				levelSpellcasting.cantrips_known !== characterSpellcasting.cantripsKnown
			) {
				dispatch(setCantripsKnown(levelSpellcasting.cantrips_known));

				if (
					classCantrips &&
					levelSpellcasting.cantrips_known < classCantrips.length
				) {
					for (
						let i = 0;
						i < classCantrips.length - levelSpellcasting.cantrips_known;
						++i
					) {
						const spellToRemove = classCantrips[classCantrips.length - (i + 1)];
						dispatch(removeSpell(spellToRemove.id));
						dispatch(removeClassSpell(spellToRemove.id));
					}
				}
			}
		},
		[dispatch, classLevels, characterSpellcasting, classSpells, classCantrips]
	);

	const removePreparedSpellsLevelChange = useCallback(
		(newLevel: number) => {
			if (shouldPrepareSpells) {
				const numAbilityScoreBonuses =
					classLevels[newLevel - 1].ability_score_bonuses;
				const abilityBonusesToRemove = classInfo.abilityBonuses.slice(
					numAbilityScoreBonuses
				);

				const abilityBonusValues = abilityBonusesToRemove.flatMap(
					values => values
				);

				const spellcastingAbilityBonusToSubtract = abilityBonusValues.filter(
					bonus => bonus === spellcastingAbility
				).length;

				let abilityScore: AbilityScore | undefined;

				if (spellcastingAbilityBonusToSubtract > 0) {
					abilityScore = (abilityScores as { [key: string]: AbilityScore })[
						spellcastingAbility as AbilityScores
					];
					abilityScore = {
						...abilityScore,
						abilityImprovement:
							abilityScore.abilityImprovement -
							spellcastingAbilityBonusToSubtract
					};
				}

				const getPreparedSpellsArgs: {
					level: number;
					abilityScore?: AbilityScore;
				} = {
					level: newLevel
				};

				if (abilityScore) {
					getPreparedSpellsArgs.abilityScore = abilityScore;
				}

				const newPreparedSpellsNumber = getNumberOfSpellsToPrepare(
					getPreparedSpellsArgs as { level: number; abilityScore: AbilityScore }
				);

				if (classSpells && newPreparedSpellsNumber < classSpells.length) {
					for (
						let i = 0;
						i < classSpells.length - newPreparedSpellsNumber;
						++i
					) {
						const spellToRemove = classSpells[classSpells.length - (i + 1)];

						dispatch(removeSpell(spellToRemove.id));
						dispatch(removeClassSpell(spellToRemove.id));
					}
				}
			}
		},
		[
			dispatch,
			shouldPrepareSpells,
			getNumberOfSpellsToPrepare,
			classSpells,
			abilityScores,
			classInfo.abilityBonuses,
			classLevels,
			spellcastingAbility
		]
	);

	useEffect(() => {
		if (
			klass.spellcasting &&
			classInfo.level === 1 &&
			!(characterSpellcasting.highestSlotLevel > 0)
		) {
			handleSpellcastingChange(1);
		}
	}, [
		klass.index,
		handleSpellcastingChange,
		klass.spellcasting,
		characterSpellcasting.highestSlotLevel,
		classInfo.level
	]);

	const removeSubclassSpells = useCallback(
		(newLevel: number) => {
			if (classInfo.subclass?.spells) {
				for (const { spell } of classInfo.subclass.spells.filter(s =>
					s.prerequisites.some(p => p.level && p.level > newLevel)
				)) {
					dispatch(removeSubclassSpell(spell.index));
					dispatch(removeSpell(spell.index));
				}
			}
		},
		[dispatch, classInfo.subclass?.spells]
	);

	const addSubclassSpells = useCallback(
		(newLevel: number) => {
			if (classInfo.subclass?.spells) {
				for (const { spell } of classInfo.subclass.spells.filter(
					s =>
						s.prerequisites.some(p => p.level && p.level <= newLevel) &&
						(classInfo.subclassSubType === undefined ||
							(classInfo.subclassSubType !== null &&
								s.prerequisites.some(
									p =>
										p.index &&
										p.index.includes(classInfo.subclassSubType as string)
								)))
				)) {
					if (classSpells?.some(cs => cs.id === spell.index)) {
						dispatch(removeClassSpell(spell.index));
					}

					if (!characterSpellcasting.spells.some(s => s.id === spell.index)) {
						dispatch(addSpell(mapSpellItem(spell)));
					}

					if (
						!(
							classInfo.subclassSpells &&
							classInfo.subclassSpells.some(s => s.id === spell.index)
						)
					) {
						dispatch(addSubclassSpell(spell));
					}
				}
			}
		},
		[
			classInfo.subclass?.spells,
			classSpells,
			dispatch,
			classInfo.subclassSpells,
			characterSpellcasting.spells,
			classInfo.subclassSubType
		]
	);

	const autoLevel = useAppSelector(
		state => state.editingCharacter.hp.autoLevel
	);

	const handleLevelHPBonuses = useCallback(
		(newLevel: number) => {
			if (newLevel < classInfo.level) {
				for (let i = 0; i < classInfo.level - newLevel; ++i) {
					dispatch(removeLevelHPBonus(undefined));
				}
			}

			if (newLevel > classInfo.level) {
				for (let i = 0; i < newLevel - classInfo.level; ++i) {
					switch (autoLevel) {
						case 'off':
							dispatch(addLevelHPBonus(null));
							break;
						case 'average':
							dispatch(addLevelHPBonus(klass.hit_die / 2 + 1));
							break;
						case 'roll':
							dispatch(addLevelHPBonus(rollDie(klass.hit_die)));
					}
				}
			}
		},
		[dispatch, autoLevel, classInfo.level, klass.hit_die]
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
				removeExpertise(newValue);
				removeMetamagic(newValue);
				removePreparedSpellsLevelChange(newValue);
				removeSubclassSpells(newValue);
			}

			if (newValue > classInfo.level) {
				addBlankFavoredEnemies(newValue);
				addDiamondSoul(newValue);
				addBlankFavoredTerrains(newValue);
				addBlankAbilityScoreBonuses(newValue);
				addPrimalChampion(newValue);
				addBlankSubclassFeatures(newValue);
				addSlipperyMind(newValue);
				addMoreExpertise(newValue);
				addSubclassSpells(newValue);
			}

			handleSpellcastingChange(newValue);
			handleLevelHPBonuses(newValue);

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
			addBlankSubclassFeatures,
			addSlipperyMind,
			removeExpertise,
			addMoreExpertise,
			removeMetamagic,
			handleSpellcastingChange,
			removePreparedSpellsLevelChange,
			addSubclassSpells,
			removeSubclassSpells,
			handleLevelHPBonuses
		]
	);

	const handleSubclassSelect = useCallback(
		(subclass: SrdSubclassItem) => {
			dispatch(selectSubclass(subclass));
			addBlankSubclassFeatures(classInfo.level, subclass);
			removeFightingStyles(classInfo.level, subclass.index);

			if (subclass.index === 'land') {
				dispatch(selectSubclassSubtype(null));
			}

			if (subclass.spells) {
				for (const { spell } of subclass.spells.filter(
					s =>
						s.prerequisites.some(p => p.level && p.level <= classInfo.level) &&
						!s.prerequisites.some(p => p.name)
				)) {
					if (classSpells?.some(cs => cs.id === spell.index)) {
						dispatch(removeClassSpell(spell.index));
					}

					if (!characterSpellcasting.spells.some(s => s.id === spell.index)) {
						dispatch(addSpell(mapSpellItem(spell)));
					}

					if (
						!(
							classInfo.subclassSpells &&
							classInfo.subclassSpells.some(s => s.id === spell.index)
						)
					) {
						dispatch(addSubclassSpell(spell));
					}
				}
			}
		},
		[
			dispatch,
			removeFightingStyles,
			classInfo.level,
			addBlankSubclassFeatures,
			classSpells,
			classInfo.subclassSpells,
			characterSpellcasting.spells
		]
	);

	const handleSubclassDeselect = useCallback(() => {
		if (classInfo.subclass?.spells) {
			for (const { spell } of classInfo.subclass.spells.filter(s =>
				s.prerequisites.some(p => p.level && p.level <= classInfo.level)
			)) {
				dispatch(removeSpell(spell.index));
				dispatch(removeSubclassSpell(spell.index));
			}
		}

		dispatch(deselectSubclassSubtype(undefined));
		removeSubclassFeatures(classInfo.level, null);
		dispatch(deselectSubclass(undefined));
		removeFightingStyles(classInfo.level, null);
	}, [
		dispatch,
		removeFightingStyles,
		classInfo.level,
		removeSubclassFeatures,
		classInfo.subclass?.spells
	]);

	const handleSelectSubclassSubtype = useCallback(
		(value: string | null) => {
			dispatch(selectSubclassSubtype(value));

			if (value !== classInfo.subclassSubType) {
				if (classInfo.subclassSubType) {
					for (const { spell } of (classInfo.subclass?.spells ?? []).filter(
						s =>
							s.prerequisites.some(
								p => p.level && p.level <= classInfo.level
							) &&
							s.prerequisites.some(p =>
								p.index?.includes(classInfo.subclassSubType as string)
							)
					)) {
						dispatch(removeSpell(spell.index));
						dispatch(removeSubclassSpell(spell.index));
					}
				}

				if (value) {
					for (const { spell } of (classInfo.subclass?.spells ?? []).filter(
						s =>
							s.prerequisites.some(
								p => p.level && p.level <= classInfo.level
							) && s.prerequisites.some(p => p.index?.includes(value as string))
					)) {
						dispatch(addSubclassSpell(spell));

						if (classSpells && classSpells.some(s => s.id === spell.index)) {
							dispatch(removeClassSpell(spell.index));
						} else {
							dispatch(addSpell(mapSpellItem(spell)));
						}
					}
				}
			}
		},
		[
			dispatch,
			classInfo.subclassSubType,
			classInfo.level,
			classInfo.subclass?.spells,
			classSpells
		]
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

	const metamagicFeature = features.find(f => f.index.includes('metamagic'));

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
					<Select
						id="select-level"
						label="Select Level"
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
			<h2 className={styles.heading}>Proficiencies</h2>
			{klass.proficiency_choices.map((choice, index) => (
				<ProficienciesSelector
					choice={choice}
					key={index}
					proficienciesIndex={index}
				/>
			))}
			{(classInfo.expertiseProficiencies?.length ?? 0) > 0 && (
				<ExpertiseSelector />
			)}
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
			{(classLevels[classInfo.level - 1].class_specific?.metamagic_known ?? 0) >
				0 && (
				<FeatureChoiceSelector
					choose={
						classLevels[classInfo.level - 1].class_specific
							?.metamagic_known as number
					}
					feature={metamagicFeature as SrdFeatureItem}
					subfeatures={
						metamagicFeature?.feature_specific?.subfeature_options.from.options.map(
							({ item }) => ({
								...item,
								name: item.name.replace(/.*:\s*/, '')
							})
						) as SrdFeatureItem[]
					}
				/>
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
