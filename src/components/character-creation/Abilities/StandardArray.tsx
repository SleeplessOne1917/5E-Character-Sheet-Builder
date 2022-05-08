import { ChangeEvent, useCallback, useState } from 'react';

import { AbilityItem } from '../../../types/srd';
import classes from './StandardArray.module.css';

const arrayValues = [8, 10, 12, 13, 14, 15];

type StandardArrayProps = {
	abilities: AbilityItem[];
};

type AbilityValues = {
	str?: number;
	dex?: number;
	con?: number;
	int?: number;
	wis?: number;
	cha?: number;
};

const StandardArray = ({ abilities }: StandardArrayProps) => {
	const [abilityValues, setAbilityValues] = useState<AbilityValues>({});
	const handleValueSelect = useCallback(
		(event: ChangeEvent<HTMLSelectElement>, abilityIndex: string) => {
			const newValue = event.target.value;

			if (newValue === 'blank') {
				const copy = { ...abilityValues };
				delete copy[abilityIndex as keyof typeof abilityValues];

				setAbilityValues(copy);
			} else {
				setAbilityValues(prevState => ({
					...prevState,
					[abilityIndex]: parseInt(newValue)
				}));
			}
		},
		[abilityValues, setAbilityValues]
	);

	return (
		<div className={classes.abilities}>
			{abilities.map(ability => (
				<div key={ability.index} className={classes.ability}>
					<h3>{ability.full_name}</h3>
					<select
						onChange={event => handleValueSelect(event, ability.index)}
						value={
							abilityValues[ability.index as keyof typeof abilityValues]
								? abilityValues[ability.index as keyof typeof abilityValues]
								: 'blank'
						}
					>
						<option value="blank">&mdash;</option>
						{(abilityValues[ability.index as keyof typeof abilityValues]
							? [abilityValues[ability.index as keyof typeof abilityValues]]
							: []
						)
							.concat(
								arrayValues.filter(
									value => !Object.values(abilityValues).includes(value)
								)
							)
							.sort((a, b) => {
								if (a < b) {
									return -1;
								} else if (a > b) {
									return 1;
								} else {
									return 0;
								}
							})
							.map(value => (
								<option key={value} value={value}>
									{value}
								</option>
							))}
					</select>
					<h4>Total: 10</h4>
				</div>
			))}
		</div>
	);
};

export default StandardArray;
