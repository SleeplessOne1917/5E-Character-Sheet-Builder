import { MouseEventHandler, useCallback } from 'react';
import { addAbility, addRolls } from '../../../../../redux/features/rollGroups';
import {
	useAppDispatch,
	useAppSelector
} from '../../../../../hooks/reduxHooks';

import { AbilityItem } from '../../../../../types/srd';
import AbilityScores from '../../../../../types/abilityScores';
import Button from '../../../../Button/Button';
import RollDisplay from '../RollDisplay/RollDisplay';
import classes from './RollGroup.module.css';
import { updateBase } from '../../../../../redux/features/abilityScores';

export type RollGroupProps = {
	onDeleteGroup?: MouseEventHandler<HTMLButtonElement> | null;
	group: number;
	abilities: AbilityItem[];
};

const rollD6 = () => Math.floor(Math.random() * (6 - 1 + 1) + 1);

const getRolls = () => [rollD6(), rollD6(), rollD6(), rollD6()];

export const sumRolls = (rolls: number[]) =>
	rolls.slice(0, 3).reduce((prev, cur) => prev + cur, 0);

const RollGroup = ({
	onDeleteGroup,
	abilities,
	group
}: RollGroupProps): JSX.Element => {
	const rollInfos = useAppSelector(state => state.rollGroups[group]);
	const dispatch = useAppDispatch();

	const resetGroups: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
		for (let i = 0; i < rollInfos.length; ++i) {
			dispatch(addRolls({ index: i, group, rolls: null }));
			dispatch(addAbility({ index: i, group, ability: null }));
		}
	}, [dispatch, group, rollInfos]);

	const roll = useCallback(
		(index: number) => {
			const rolls = getRolls();
			const orderedRolls = rolls.sort((a, b) => {
				if (a < b) {
					return 1;
				} else if (a > b) {
					return -1;
				} else {
					return 0;
				}
			});

			dispatch(addRolls({ index, group, rolls: orderedRolls }));
		},
		[dispatch, group]
	);

	const selectAbility = useCallback(
		(value: string, index: number) => {
			dispatch(
				addAbility({
					index,
					group,
					ability: value === 'blank' ? null : (value as AbilityScores)
				})
			);
		},
		[dispatch, group]
	);

	const onApplyGroup = useCallback(() => {
		for (const info of rollInfos) {
			if (info.ability && info.rolls) {
				dispatch(
					updateBase({
						value: sumRolls(info.rolls),
						abilityIndex: info.ability as AbilityScores
					})
				);
			}
		}
	}, [dispatch, rollInfos]);

	return (
		<div className={classes['roll-group']} data-testid="roll-group">
			{onDeleteGroup && (
				<Button onClick={onDeleteGroup} size="small">
					Delete Group
				</Button>
			)}
			<div className={classes.rolls}>
				{rollInfos.map((info, index) => (
					<RollDisplay
						key={index}
						abilities={(info.ability
							? abilities.filter(a => a.index === info.ability)
							: []
						).concat(
							abilities.filter(
								ability =>
									!rollInfos
										.map(rInfo => rInfo.ability)
										.includes(ability.index as AbilityScores)
							)
						)}
						roll={() => roll(index)}
						rolls={info.rolls}
						onSelectAbility={value => selectAbility(value, index)}
						ability={info.ability}
						total={info.rolls ? sumRolls(info.rolls) : undefined}
						selectTestId={`roll-${index}`}
					/>
				))}
			</div>
			<div>
				<Button
					onClick={resetGroups}
					size="small"
					spacing={4}
					disabled={
						!rollInfos.some(info => {
							if (info.rolls) {
								return true;
							} else {
								return false;
							}
						})
					}
				>
					Reset Group
				</Button>
				<Button
					positive
					onClick={onApplyGroup}
					disabled={!rollInfos.some(info => info.ability)}
					size="small"
				>
					Apply Ability Scores
				</Button>
			</div>
		</div>
	);
};

export default RollGroup;
