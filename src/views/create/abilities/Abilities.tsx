import { ChangeEventHandler, useCallback, useState } from 'react';

import AbilityCalculation from '../../../components/character-creation/Abilities/AbilityCalculation';
import { AbilityItem } from '../../../types/srd';
import classes from './Abilities.module.css';
import commonClasses from '../../Views.module.css';

type AbilitiesProps = {
	abilities: AbilityItem[];
};

const Abilities = ({ abilities }: AbilitiesProps): JSX.Element => {
	const [generationMethod, setGenerationMethod] = useState('roll');

	const handleGenerationMethodChange: ChangeEventHandler<HTMLSelectElement> =
		useCallback(
			event => {
				setGenerationMethod(event.target.value);
			},
			[setGenerationMethod]
		);

	return (
		<main className={commonClasses.main}>
			<div className={commonClasses.content}>
				<h1 className={classes.title}>Ability Scores</h1>
				<div className={classes['generation-control']}>
					<label htmlFor="generation-methods">Generation Method</label>
					<select
						id="generation-methods"
						value={generationMethod}
						onChange={handleGenerationMethodChange}
					>
						<option value="roll">Manual/Rolled</option>
						<option value="point-buy">Point Buy</option>
						<option value="array">Standard Array</option>
					</select>
				</div>
				{generationMethod === 'roll' && 'Roll'}
				{generationMethod === 'point-buy' && 'Point Buy'}
				{generationMethod === 'array' && 'Standard Array'}
				<div className={classes['calculations-container']}>
					{abilities.map(ability => (
						<AbilityCalculation
							key={ability.index}
							index={ability.index}
							name={ability.full_name}
						/>
					))}
				</div>
			</div>
		</main>
	);
};

export default Abilities;