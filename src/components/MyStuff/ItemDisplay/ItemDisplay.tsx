import Button from '../../Button/Button';
import { Item } from '../../../types/db/item';
import classes from './ItemDisplay.module.css';
import { useCallback } from 'react';

type ItemDisplayProps = {
	item: Item;
	onMoreInfoClick: (item: Item) => void;
};

const ItemDisplay = ({ item, onMoreInfoClick }: ItemDisplayProps) => {
	const handleMoreInfoClick = useCallback(
		() => onMoreInfoClick(item),
		[onMoreInfoClick, item]
	);

	return (
		<div className={classes.item} data-testid="item">
			<div className={classes.info}>{item.name}</div>
			<Button size="small" positive onClick={handleMoreInfoClick}>
				More Info
			</Button>
		</div>
	);
};

export default ItemDisplay;
