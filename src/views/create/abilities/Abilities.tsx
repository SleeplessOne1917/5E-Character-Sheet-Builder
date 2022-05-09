import {
	ChangeEventHandler,
	MouseEventHandler,
	useCallback,
	useState
} from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { addGroup, removeGroup } from '../../../redux/features/rollGroups';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';

import AbilityCalculation from '../../../components/character-creation/Abilities/AbilityCalculation';
import { AbilityItem } from '../../../types/srd';
import AbilityScores from '../../../types/abilityScores';
import ManualScores from '../../../components/character-creation/Abilities/ManualScores';
import PointBuy from '../../../components/character-creation/Abilities/PointBuy';
import RollGroup from '../../../components/character-creation/Abilities/RollGroup';
import SmallButton from '../../../components/Button/SmallButton';
import StandardArray from '../../../components/character-creation/Abilities/StandardArray';
import classes from './Abilities.module.css';
import commonClasses from '../../Views.module.css';
import { updateBase } from '../../../redux/features/abilityScores';

type AbilitiesProps = {
	abilities: AbilityItem[];
};

const Abilities = ({ abilities }: AbilitiesProps): JSX.Element => {
	const [generationMethod, setGenerationMethod] = useState('roll');
	const [showRollGroups, setShowRollGroups] = useState(true);
	const rollGroups = useAppSelector(state => state.rollGroups);
	const dispatch = useAppDispatch();

	const handleGenerationMethodChange: ChangeEventHandler<HTMLSelectElement> =
		useCallback(
			event => {
				{
					const value = event.target.value;

					if (value === 'point-buy') {
						for (const { index } of abilities) {
							dispatch(
								updateBase({ value: 8, abilityIndex: index as AbilityScores })
							);
						}
					} else {
						for (const { index } of abilities) {
							dispatch(
								updateBase({
									value: null,
									abilityIndex: index as AbilityScores
								})
							);
						}
					}

					setGenerationMethod(value);
				}
			},
			[setGenerationMethod, dispatch, abilities]
		);

	const toggleShowRollGroups: MouseEventHandler<HTMLDivElement> =
		useCallback(() => {
			setShowRollGroups(prevState => !prevState);
		}, [setShowRollGroups]);

	const addRollGroup: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
		dispatch(addGroup());
	}, [dispatch]);

	const deleteRollGroup = useCallback(
		(group: number) => {
			dispatch(removeGroup({ group }));
		},
		[dispatch]
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
						<option value="manual">Manual</option>
						<option value="roll">Roll</option>
						<option value="point-buy">Point Buy</option>
						<option value="array">Standard Array</option>
					</select>
				</div>
				{generationMethod === 'manual' && (
					<ManualScores abilities={abilities} />
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
							<div className={classes['add-group-container']}>
								<SmallButton
									positive
									style={{ marginRight: '0.5rem' }}
									onClick={addRollGroup}
								>
									+ Add Group
								</SmallButton>
								Groups: {Object.keys(rollGroups).length}
							</div>
							<div>
								{Object.keys(rollGroups).map(group => (
									<RollGroup
										abilities={abilities}
										key={group}
										onDeleteGroup={
											Object.keys(rollGroups).length > 1
												? () => deleteRollGroup(parseInt(group))
												: null
										}
										group={parseInt(group)}
									/>
								))}
							</div>
						</div>
					</>
				)}
				{generationMethod === 'point-buy' && <PointBuy abilities={abilities} />}
				{generationMethod === 'array' && (
					<StandardArray abilities={abilities} />
				)}
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
