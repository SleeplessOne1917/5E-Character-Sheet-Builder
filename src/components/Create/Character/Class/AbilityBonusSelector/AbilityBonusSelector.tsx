import { AbilityItem } from '../../../../../types/srd';
import AbilityScores from '../../../../../types/abilityScores';
import { ReactNode } from 'react';
import Select from '../../../../Select/Select/Select';
import classes from './AbilityBonusSelector.module.css';

type AbilityBonusSelectorProps = {
	values: (AbilityScores | null)[];
	onChange: (values: (AbilityScores | null)[]) => void;
	abilities: AbilityItem[];
};

const AbilityBonusSelector = ({
	values,
	onChange,
	abilities
}: AbilityBonusSelectorProps) => {
	const options = [{ value: 'blank', label: '\u2014' }].concat(
		abilities.map(ability => ({
			value: ability.index,
			label: ability.full_name
		}))
	);

	return (
		<div
			className={`${classes.container}${
				!values.some(val => val === null) ? ` ${classes.selected}` : ''
			}`}
			data-testid="ability-bonus-selector"
		>
			<h3 className={classes.header}>Select Ability Score Bonuses</h3>
			<div className={classes.pluses}>
				{!values.some(val => val === null) && values[0] === values[1]
					? `${
							abilities.find(ability => ability.index === values[0])?.full_name
					  } +2`
					: values.reduce<ReactNode[]>((acc, cur) => {
							if (cur !== null) {
								const ability = abilities.find(
									ability => ability.index === cur
								);
								return [
									...acc,
									<div key={ability?.index}>{`${ability?.full_name} +1`}</div>
								];
							} else {
								return acc;
							}
					  }, [])}
			</div>
			<div className={classes.selects}>
				<Select
					value={values[0] ?? 'blank'}
					options={options}
					onChange={value =>
						onChange([
							value === 'blank' ? null : (value as AbilityScores),
							values[1]
						])
					}
				/>
				<Select
					value={values[1] ?? 'blank'}
					options={options}
					onChange={value =>
						onChange([
							values[0],
							value === 'blank' ? null : (value as AbilityScores)
						])
					}
				/>
			</div>
		</div>
	);
};

export default AbilityBonusSelector;
