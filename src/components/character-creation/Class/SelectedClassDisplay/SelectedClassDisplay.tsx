import {
	AbilityItem,
	ClassLevel,
	SrdFeatureItem,
	SrdFullClassItem,
	SrdSubclassItem
} from '../../../../types/srd';
import {
	addAbilityBonus,
	deselectSubclass,
	removeAbilityBonus,
	selectSubclass,
	setAbilityBonus,
	setLevel
} from '../../../../redux/features/classInfo';
import {
	decrementAbilityBonus,
	incrementAbilityBonus
} from '../../../../redux/features/abilityScores';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import { useCallback, useEffect } from 'react';

import AbilityBonusSelector from '../AbilityBonusSelector/AbilityBonusSelector';
import AbilityScores from '../../../../types/abilityScores';
import Descriptor from '../../Descriptor/Descriptor';
import Select from '../../../Select/Select';
import SubclassSelector from '../SubclassSelector/SubclassSelector';
import styles from './SelectedClassDisplay.module.css';
import { getOrdinal } from '../../../../services/ordinalService';

type SelectedClassDisplayProps = {
	klass: SrdFullClassItem;
	abilities: AbilityItem[];
};

const SelectedClassDisplay = ({
	klass,
	abilities
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

	useEffect(() => {
		const numAbilityScoreBonuses =
			classLevels[classInfo.level - 1].ability_score_bonuses;

		if (numAbilityScoreBonuses > classInfo.abilityBonuses.length) {
			for (
				let i = 0;
				i < numAbilityScoreBonuses - classInfo.abilityBonuses.length;
				++i
			) {
				dispatch(addAbilityBonus([null, null]));
			}
		}

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
	}, [dispatch, classInfo.level, classInfo.abilityBonuses, classLevels]);

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

	const handleLevelChange = useCallback(
		(value: number) => {
			dispatch(setLevel(value));
		},
		[dispatch]
	);

	const handleSubclassSelect = useCallback(
		(subclass: SrdSubclassItem) => {
			dispatch(selectSubclass(subclass));
		},
		[dispatch]
	);

	const handleSubclassDeselect = useCallback(() => {
		dispatch(deselectSubclass());
	}, [dispatch]);

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
					{classLevels.map(
						(
							{ level, prof_bonus, features, spellcasting, class_specific },
							index
						) => {
							const featureNames = features.map(({ name }) => {
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
										level === classInfo.level ? styles['current-level-row'] : ''
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
											{hasSpellsKnown && <td>{spellcasting?.spells_known}</td>}
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
			<h2 className={styles.heading}>Features</h2>
			{(
				classLevels as Partial<ClassLevel>[] &
					Pick<ClassLevel, 'level' | 'features'>[]
			)
				.concat(classInfo.subclass?.subclass_levels ?? [])
				.sort((a, b) => a.level - b.level)
				.filter(level => level.level <= classInfo.level)
				.flatMap(level => level.features)
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
				}, [])
				.map(feature => (
					<Descriptor
						key={feature.index}
						description={feature.desc}
						title={feature.name}
					/>
				))}
		</div>
	);
};

export default SelectedClassDisplay;
