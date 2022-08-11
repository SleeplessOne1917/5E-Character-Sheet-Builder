import { ChangeEvent, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import { setLevel } from '../../../../redux/features/classInfo';
import { SrdFullClassItem } from '../../../../types/srd';
import styles from './SelectedClassDisplay.module.css';

type SelectedClassDisplayProps = {
	klass: SrdFullClassItem;
};

const getOrdinalString = (n: number) => {
	const strNum = `${n}`;

	let ordinal = '';
	if (strNum.endsWith('1') && !strNum.endsWith('13')) {
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

	const spellCastingLevels: number[] = [];
	if (hasSpellcasting && klass.index !== 'warlock') {
		for (let i = 1; i <= 9; ++i) {
			if (
				/* eslint-disable @typescript-eslint/ban-ts-comment */
				// @ts-ignore
				klass.class_levels[0].spellcasting[`spell_slots_level_${i}`] !== null
			) {
				spellCastingLevels.push(i);
			} else {
				break;
			}
		}
	}

	const levelNumbers: number[] = [];
	for (let i = 1; i <= 20; ++i) {
		levelNumbers.push(i);
	}

	const handleLevelChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			dispatch(setLevel(parseInt(event.target.value, 10)));
		},
		[dispatch]
	);

	return (
		<div>
			<div className={styles['level-select-container']}>
				<div className={styles['level-select-label']}>Select Level</div>
				<select className={styles['level-select']} onChange={handleLevelChange}>
					<option value={0}>&mdash;</option>
					{levelNumbers.map(num => (
						<option key={num} value={num}>
							{num}
						</option>
					))}
				</select>
			</div>
			<table className={styles.table}>
				<tr>
					<th className={styles.head}>Level</th>
					<th className={styles.head}>Proficiency Bonus</th>
					<th className={styles.head}>Features</th>
					{hasSpellcasting && (
						<>
							{hasCantrips && <th className={styles.head}>Cantrips Known</th>}
							{hasSpellsKnown && <th className={styles.head}>Spells Known</th>}
							{spellCastingLevels.map(level => (
								<th key={level} className={styles.head}>
									{getOrdinalString(level)}
								</th>
							))}
						</>
					)}
				</tr>
				{[...klass.class_levels]
					.sort((a, b) => a.level - b.level)
					.filter(level => !level.subclass)
					.map(({ level, prof_bonus, features, spellcasting }, index) => {
						const featureNames = features.map(({ name }) => name);
						return (
							<tr
								key={`${klass.index}-${level}`}
								className={`${index % 2 === 1 ? styles.odd : ''} ${
									level === classInfo.level ? styles['current-level-row'] : ''
								}`}
							>
								<td>{getOrdinalString(level)}</td>
								<td>+{prof_bonus}</td>
								<td>
									{featureNames.length > 0 ? featureNames.join(', ') : '\u2014'}
								</td>
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
												}
											</td>
										))}
									</>
								)}
							</tr>
						);
					})}
			</table>
		</div>
	);
};

export default SelectedClassDisplay;
