import {
	ChangeEventHandler,
	MouseEventHandler,
	useCallback,
	useState
} from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';

import AbilityCalculation from '../../../components/character-creation/Abilities/AbilityCalculation';
import { AbilityItem } from '../../../types/srd';
import RollGroup from '../../../components/character-creation/Abilities/RollGroup';
import SmallButton from '../../../components/Button/SmallButton';
import classes from './Abilities.module.css';
import commonClasses from '../../Views.module.css';

type AbilitiesProps = {
	abilities: AbilityItem[];
};

const Abilities = ({ abilities }: AbilitiesProps): JSX.Element => {
	const [generationMethod, setGenerationMethod] = useState('roll');
	const [showRollGroups, setShowRollGroups] = useState(true);

	const handleGenerationMethodChange: ChangeEventHandler<HTMLSelectElement> =
		useCallback(
			event => {
				setGenerationMethod(event.target.value);
			},
			[setGenerationMethod]
		);

	const toggleShowRollGroups: MouseEventHandler<HTMLDivElement> =
		useCallback(() => {
			setShowRollGroups(prevState => !prevState);
		}, [setShowRollGroups]);

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
						<option value="manual">Manual</option>
						<option value="roll">Roll</option>
						<option value="point-buy">Point Buy</option>
						<option value="array">Standard Array</option>
					</select>
				</div>
				{generationMethod === 'manual' && (
					<div className={classes['manual-scores']}>
						{abilities.map(ability => (
							<div key={ability.index} className={classes['manual-score']}>
								<h3>{ability.full_name}</h3>
								<input type="text" />
								<h4>Total: 10</h4>
							</div>
						))}
					</div>
				)}
				{generationMethod === 'roll' && (
					<>
						<div
							className={classes['roll-groups-toggle']}
							onClick={toggleShowRollGroups}
						>
							Dice Roll Groups{' '}
							{showRollGroups ? (
								<ChevronUpIcon className={classes['roll-chevron']} />
							) : (
								<ChevronDownIcon className={classes['roll-chevron']} />
							)}
						</div>
						<div
							className={`${classes['roll-groups']}${
								showRollGroups ? ` ${classes.open}` : ''
							}`}
						>
							<SmallButton positive>+ Add Group</SmallButton>
							<div>
								<RollGroup abilities={abilities} />
							</div>
						</div>
					</>
				)}
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
