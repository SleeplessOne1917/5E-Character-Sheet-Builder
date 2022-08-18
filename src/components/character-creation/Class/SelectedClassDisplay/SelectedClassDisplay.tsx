import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';

import Select from '../../../Select/Select';
import { SrdFullClassItem } from '../../../../types/srd';
import { setLevel } from '../../../../redux/features/classInfo';
import styles from './SelectedClassDisplay.module.css';

type SelectedClassDisplayProps = {
	klass: SrdFullClassItem;
};

const getOrdinal = (n: number) => {
	const strNum = `${n}`;

	let ordinal = '';
	if (strNum.endsWith('1') && !strNum.endsWith('11')) {
		ordinal = 'st';
	} else if (strNum.endsWith('2') && !strNum.endsWith('12')) {
		ordinal = 'nd';
	} else if (strNum.endsWith('3') && !strNum.endsWith('13')) {
		ordinal = 'rd';
	} else {
		ordinal = 'th';
	}

	return (
		<span>
			{strNum}
			<span className={styles.ordinal}>{ordinal}</span>
		</span>
	);
};

const SelectedClassDisplay = ({ klass }: SelectedClassDisplayProps) => {
	const dispatch = useAppDispatch();
	const classInfo = useAppSelector(state => state.editingCharacter.classInfo);
	const hasSpellcasting = !!klass.spellcasting;
	const hasCantrips = !!klass.class_levels[0].spellcasting?.cantrips_known;
	const hasSpellsKnown = klass.class_levels.some(
		level => level.spellcasting?.spells_known
	);

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

	const classLevels = [...klass.class_levels]
		.sort((a, b) => a.level - b.level)
		.filter(level => !level.subclass);

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

	return (
		<div>
			<div className={styles['level-select-container']}>
				<label className={styles['level-select-label']} id="select-level">
					Select Level
				</label>
				<Select
					labelledBy="select-level"
					onChange={value => handleLevelChange(value as number)}
					options={[{ value: 0, label: '\u2014' }].concat(
						levelNumbers.map(num => ({ value: num, label: `${num}` }))
					)}
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
						const featureNames = features.map(({ name }) =>
							name.replace(/Spellcasting:.*/i, 'Spellcasting')
						);

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
									{featureNames.length > 0 ? featureNames.join(', ') : '\u2014'}
								</td>
								{klass.index === 'barbarian' && (
									<>
										<td>
											{level === 20 ? 'Unlimited' : class_specific?.rage_count}
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
	);
};

export default SelectedClassDisplay;
