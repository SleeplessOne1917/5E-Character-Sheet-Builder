import Button from '../../Button/Button';
import { Spell } from '../../../types/characterSheetBuilderAPI';
import classes from './SpellItem.module.css';
import { useCallback } from 'react';

type SpellItemProps = {
	spell: Spell;
	onMoreInfoClick: (spell: Spell) => void;
};

const SpellItem = ({ spell, onMoreInfoClick }: SpellItemProps) => {
	const handleMoreInfoClick = useCallback(
		() => onMoreInfoClick(spell),
		[onMoreInfoClick, spell]
	);

	return (
		<div className={classes.item} data-testid="spell-item">
			<div className={classes['spell-info']}>
				<svg className={classes['school-icon']}>
					<use xlinkHref={`/Icons.svg#${spell.school.id}`} />
				</svg>
				{spell.name}
			</div>
			<Button size="small" positive onClick={handleMoreInfoClick}>
				More Info
			</Button>
		</div>
	);
};

export default SpellItem;
