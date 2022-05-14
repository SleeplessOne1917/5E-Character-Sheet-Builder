import {
	ChangeEventHandler,
	KeyboardEventHandler,
	MouseEventHandler,
	useCallback,
	useState
} from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { addGroup, removeGroup } from '../../../redux/features/rollGroups';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';

import AbilityCalculation from '../../../components/character-creation/Abilities/AbilityCalculation/AbilityCalculation';
import { AbilityItem } from '../../../types/srd';
import AbilityScores from '../../../types/abilityScores';
import Button from '../../../components/Button/Button';
import MainContent from '../../../components/MainContent/MainContent';
import ManualScores from '../../../components/character-creation/Abilities/ManualScores';
import PointBuy from '../../../components/character-creation/Abilities/PointBuy';
import RollGroup from '../../../components/character-creation/Abilities/RollGroup';
import StandardArray from '../../../components/character-creation/Abilities/StandardArray';
import classes from './Abilities.module.css';
import { updateBase } from '../../../redux/features/abilityScores';
import { updateGenerationMethod } from '../../../redux/features/generationMethod';

type AbilitiesProps = {
	abilities: AbilityItem[];
};

const Abilities = ({ abilities }: AbilitiesProps): JSX.Element => {
	const [showRollGroups, setShowRollGroups] = useState(true);
	const rollGroups = useAppSelector(state => state.rollGroups);
	const generationMethod = useAppSelector(state => state.generationMethod);
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

					dispatch(updateGenerationMethod({ generationMethod: value }));
				}
			},
			[dispatch, abilities]
		);

	const toggleShowRollGroups = useCallback(() => {
		setShowRollGroups(prevState => !prevState);
	}, [setShowRollGroups]);

	const toggleShowRollGroupsKeyUp: KeyboardEventHandler<HTMLDivElement> =
		useCallback(
			event => {
				if (event.code === 'Enter') {
					toggleShowRollGroups();
				}
			},
			[toggleShowRollGroups]
		);

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
		<MainContent>
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
			{generationMethod === 'manual' && <ManualScores abilities={abilities} />}
			{generationMethod === 'roll' && (
				<>
					<div
						className={classes['roll-groups-toggle']}
						onClick={toggleShowRollGroups}
						onKeyUp={toggleShowRollGroupsKeyUp}
						tabIndex={0}
						aria-label={`${showRollGroups ? 'Hide' : 'Show'} Roll Groups`}
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
							<Button positive size="small" spacing={2} onClick={addRollGroup}>
								+ Add Group
							</Button>
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
			{generationMethod === 'array' && <StandardArray abilities={abilities} />}
			<div className={classes['calculations-container']}>
				{abilities.map(ability => (
					<AbilityCalculation
						key={ability.index}
						index={ability.index}
						name={ability.full_name}
					/>
				))}
			</div>
		</MainContent>
	);
};

export default Abilities;
