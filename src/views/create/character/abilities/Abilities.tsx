import {
	AbilityScore,
	updateBase
} from '../../../../redux/features/abilityScores';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import {
	GenerationMethodState,
	updateGenerationMethod
} from '../../../../redux/features/generationMethod';
import {
	KeyboardEventHandler,
	MouseEventHandler,
	useCallback,
	useState
} from 'react';
import { addGroup, removeGroup } from '../../../../redux/features/rollGroups';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';

import AbilityCalculation from '../../../../components/character-creation/Abilities/AbilityCalculation/AbilityCalculation';
import { AbilityItem } from '../../../../types/srd';
import AbilityScores from '../../../../types/abilityScores';
import Button from '../../../../components/Button/Button';
import GeneralInfoBar from '../../../../components/character-creation/GeneralInfoBar/GeneralInfoBar';
import MainContent from '../../../../components/MainContent/MainContent';
import ManualScores from '../../../../components/character-creation/Abilities/ManualScores/ManualScores';
import PointBuy from '../../../../components/character-creation/Abilities/PointBuy/PointBuy';
import RollGroup from '../../../../components/character-creation/Abilities/Rolls/RollGroup/RollGroup';
import Select from '../../../../components/Select/Select';
import StandardArray from '../../../../components/character-creation/Abilities/StandardArray/StandardArray';
import classes from './Abilities.module.css';
import { handleKeyDownEvent } from '../../../../services/handlerService';
import { removeClassSpell } from '../../../../redux/features/classInfo';
import { removeSpell } from '../../../../redux/features/spellcasting';
import usePreparedSpells from '../../../../hooks/usePreparedSpells';

type AbilitiesProps = {
	abilities: AbilityItem[];
};

const Abilities = ({ abilities }: AbilitiesProps): JSX.Element => {
	const [showRollGroups, setShowRollGroups] = useState(true);
	const rollGroups = useAppSelector(state => state.rollGroups);
	const generationMethod = useAppSelector(state => state.generationMethod);
	const dispatch = useAppDispatch();
	const { getNumberOfSpellsToPrepare, shouldPrepareSpells } =
		usePreparedSpells();
	const classSpells = useAppSelector(
		state => state.editingCharacter.classInfo.spells
	)?.filter(({ level }) => level > 0);
	const spellcastingAbility = useAppSelector(
		state =>
			state.editingCharacter.classInfo.class?.spellcasting?.spellcasting_ability
				.index
	);
	const abilityScores = useAppSelector(
		state => state.editingCharacter.abilityScores
	);

	const removePreparedSpells = useCallback(
		(value: number | null, abilityScoreIndex: AbilityScores) => {
			if (
				spellcastingAbility &&
				abilityScoreIndex === spellcastingAbility &&
				shouldPrepareSpells
			) {
				const newPreparedSpellsNumber = getNumberOfSpellsToPrepare({
					abilityScore: {
						...(
							abilityScores as {
								[key: string]: AbilityScore;
							}
						)[abilityScoreIndex],
						base: value
					}
				});

				if (classSpells && newPreparedSpellsNumber < classSpells.length) {
					for (
						let i = 0;
						i < classSpells.length - newPreparedSpellsNumber;
						++i
					) {
						const spellToRemove = classSpells[classSpells.length - (i + 1)];

						dispatch(removeSpell(spellToRemove.index));
						dispatch(removeClassSpell(spellToRemove.index));
					}
				}
			}
		},
		[
			abilityScores,
			classSpells,
			dispatch,
			getNumberOfSpellsToPrepare,
			shouldPrepareSpells,
			spellcastingAbility
		]
	);

	const handleGenerationMethodChange = useCallback(
		(value: string) => {
			{
				if (value === 'point-buy') {
					for (const { index } of abilities) {
						dispatch(updateBase({ value: 8, abilityIndex: index }));

						removePreparedSpells(8, index);
					}
				} else {
					for (const { index } of abilities) {
						dispatch(
							updateBase({
								value: null,
								abilityIndex: index
							})
						);

						removePreparedSpells(null, index);
					}
				}

				dispatch(
					updateGenerationMethod({
						generationMethod: value as GenerationMethodState
					})
				);
			}
		},
		[dispatch, abilities, removePreparedSpells]
	);

	const toggleShowRollGroups = useCallback(() => {
		setShowRollGroups(prevState => !prevState);
	}, [setShowRollGroups]);

	const toggleShowRollGroupsKeyDown: KeyboardEventHandler<HTMLDivElement> =
		useCallback(
			event => {
				handleKeyDownEvent<HTMLDivElement>(event, toggleShowRollGroups);
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
		<MainContent testId="abilities">
			<GeneralInfoBar />
			<h1 className={classes.title}>Ability Scores</h1>
			<div className={classes['generation-control']}>
				<label id="generation-methods-label">Generation Method</label>
				<Select
					testId="generation-method"
					labelledBy="generation-methods"
					value={generationMethod}
					onChange={value => handleGenerationMethodChange(value as string)}
					options={[
						{ value: 'manual', label: 'Manual' },
						{ value: 'roll', label: 'Roll' },
						{ value: 'point-buy', label: 'Point Buy' },
						{ value: 'array', label: 'Standard Array' }
					]}
				/>
			</div>
			{generationMethod === 'manual' && <ManualScores abilities={abilities} />}
			{generationMethod === 'roll' && (
				<>
					<div
						className={classes['roll-groups-toggle']}
						onClick={toggleShowRollGroups}
						onKeyDown={toggleShowRollGroupsKeyDown}
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
						data-testid="roll-groups"
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
