import { MonsterSubtype, MonsterType } from '../../../../types/srd';

import Select from '../../../Select/Select';
import classes from './FavoredEnemySelector.module.css';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import { useCallback } from 'react';

type FavoredEnemySelectorProps = {
	values: (MonsterType | MonsterSubtype | null)[];
	onChange: (values: (MonsterType | MonsterSubtype | null)[]) => void;
	monsters: { humanoids: MonsterSubtype[]; monsters: MonsterType[] };
};

const FavoredEnemySelector = ({
	values,
	onChange,
	monsters
}: FavoredEnemySelectorProps) => {
	const handleChange = useCallback(
		(value: MonsterType) => {
			if (value === 'HUMANOID' && values.length === 1) {
				onChange([null, null]);
			} else if (value !== 'HUMANOID') {
				onChange([value]);
			}
		},
		[onChange, values.length]
	);

	const selectedTypes = useAppSelector(
		state => state.editingCharacter.classInfo.favoredEnemies
	)?.flatMap(val => val);

	return (
		<div
			className={`${classes.container}${
				!values.includes(null) ? ` ${classes.selected}` : ''
			}`}
			data-testid="favored-enemy-selector"
		>
			<div className={classes['monster-type-container']}>
				<label id="monster-type" className={classes.label}>
					Select Monster Type
				</label>
				<Select
					labelledBy="monster-type"
					onChange={value =>
						handleChange((value === 'blank' ? null : value) as MonsterType)
					}
					options={[{ label: '\u2014', value: 'blank' }].concat(
						monsters.monsters
							.filter(m => !selectedTypes?.includes(m) || values.includes(m))
							.map(m => ({ label: m[0] + m.slice(1).toLowerCase(), value: m }))
					)}
					value={
						values.length > 1
							? 'HUMANOID'
							: values[0] === null
							? 'blank'
							: values[0]
					}
				/>
			</div>
			{values.length > 1 && (
				<div className={classes['humanoid-container']}>
					<div className={classes['monster-type-container']}>
						<label className={classes.label} id="humanoid-1">
							Select Humanoid Type 1
						</label>
						<Select
							labelledBy="humanoid-1"
							onChange={value =>
								onChange([
									(value === 'blank' ? null : value) as MonsterSubtype,
									values[1]
								])
							}
							options={[{ value: 'blank', label: '\u2014' }].concat(
								monsters.humanoids
									.filter(h => !selectedTypes?.includes(h) || values[0] === h)
									.map(h => ({
										value: h,
										label: h[0] + h.slice(1).toLowerCase()
									}))
							)}
							value={values[0] ?? 'blank'}
						/>
					</div>
					<div className={classes['monster-type-container']}>
						<label className={classes.label} id="humanoid-2">
							Select Humanoid Type 2
						</label>
						<Select
							labelledBy="humanoid-2"
							onChange={value =>
								onChange([
									values[0],
									(value === 'blank' ? null : value) as MonsterSubtype
								])
							}
							options={[{ value: 'blank', label: '\u2014' }].concat(
								monsters.humanoids
									.filter(h => !selectedTypes?.includes(h) || values[1] === h)
									.map(h => ({
										value: h,
										label: h[0] + h.slice(1).toLowerCase()
									}))
							)}
							value={values[1] ?? 'blank'}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default FavoredEnemySelector;
