import Button from '../../Button/Button';
import { SpellItem } from '../../../types/characterSheetBuilderAPI';
import classes from './SpellItemDisplay.module.css';
import { useCallback } from 'react';

type SpellItemDisplayProps = {
	spell: SpellItem;
	onMoreInfoClick: (spell: SpellItem) => void;
};

const SpellItemDisplay = ({
	spell,
	onMoreInfoClick
}: SpellItemDisplayProps) => {
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

export default SpellItemDisplay;
