import { ChangeEvent, MouseEventHandler, useState } from 'react';

import { AbilityItem } from '../../../types/srd';
import RollDisplay from './RollDisplay';
import SmallButton from '../../Button/SmallButton';
import classes from './RollGroup.module.css';

type RollGroupProps = {
	onDeleteGroup?: MouseEventHandler<HTMLButtonElement>;
	onApplyGroup?: MouseEventHandler<HTMLButtonElement>;
	abilities: AbilityItem[];
};

type RollInfo = {
	rolls?: number[];
	ability: string;
	total?: number;
};

const getInitialRollInfos = () => [
	{ ability: 'blank' },
	{ ability: 'blank' },
	{ ability: 'blank' },
	{ ability: 'blank' },
	{ ability: 'blank' },
	{ ability: 'blank' }
];

const rollD6 = () => Math.floor(Math.random() * (6 - 1 + 1) + 1);

const getRolls = () => [rollD6(), rollD6(), rollD6(), rollD6()];

const RollGroup = ({
	onDeleteGroup,
	onApplyGroup,
	abilities
}: RollGroupProps) => {
	const [rollInfos, setRollInfos] = useState<RollInfo[]>(getInitialRollInfos());

	const resetGroups: MouseEventHandler<HTMLButtonElement> = () => {
		setRollInfos(getInitialRollInfos());
	};

	const roll = (index: number) => {
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
		const total = orderedRolls.slice(0, 3).reduce((prev, cur) => prev + cur, 0);

		const copy = rollInfos.slice();
		copy[index].rolls = orderedRolls;
		copy[index].total = total;
		setRollInfos(copy);
	};

	const selectAbility = (
		event: ChangeEvent<HTMLSelectElement>,
		index: number
	) => {
		const newAbility = event.target.value;
		const copy = rollInfos.slice();

		copy[index].ability = newAbility;
		setRollInfos(copy);
	};

	return (
		<div className={classes['roll-group']}>
			{onDeleteGroup && (
				<SmallButton onClick={onDeleteGroup}>Delete Group</SmallButton>
			)}
			<div className={classes.rolls}>
				{rollInfos.map((info, index) => (
					<RollDisplay
						key={index}
						abilities={abilities.filter(
							ability =>
								!rollInfos.map(rInfo => rInfo.ability).includes(ability.index)
						)}
						roll={() => roll(index)}
						rolls={info.rolls}
						onSelectAbility={event => selectAbility(event, index)}
						ability={info.ability}
						total={info.total}
					/>
				))}
			</div>
			<div>
				<SmallButton onClick={resetGroups} style={{ marginRight: '1rem' }}>
					Reset Group
				</SmallButton>
				<SmallButton positive onClick={onApplyGroup}>
					Apply Ability Scores
				</SmallButton>
			</div>
		</div>
	);
};

export default RollGroup;
