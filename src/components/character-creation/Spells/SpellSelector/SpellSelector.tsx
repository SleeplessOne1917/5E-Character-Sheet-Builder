import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon
} from '@heroicons/react/20/solid';
import { KeyboardEventHandler, useCallback, useState } from 'react';
import { SrdItem, SrdSpellItem } from '../../../../types/srd';

import Button from '../../../Button/Button';
import classes from './SpellSelector.module.css';
import { handleKeyDownEvent } from '../../../../services/handlerService';
import useMediaQuery from '../../../../hooks/useMediaQuery';

type SpellSelectorProps = {
	spell: SrdSpellItem;
	item?: SrdItem;
	onAdd: () => void;
	onRemove: () => void;
	selectValues: string[];
};

const SpellSelector = ({
	spell,
	item,
	onAdd,
	onRemove,
	selectValues
}: SpellSelectorProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const isMediumOrLarger = useMediaQuery('(min-width: 768px)');
	const isSelected = selectValues.includes(spell.index);

	const toggleOpen = useCallback(
		() => setIsOpen(prevState => !prevState),
		[setIsOpen]
	);

	const toggleOpenKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
		event => {
			handleKeyDownEvent<HTMLDivElement>(event, toggleOpen);
		},
		[toggleOpen]
	);

	return (
		<div className={classes.selector} data-testid="spell-selector">
			<div
				className={classes['selector-label']}
				role="button"
				tabIndex={0}
				aria-label={`${item ? `${item?.name} ` : ''}${spell.name}`}
				onClick={toggleOpen}
				onKeyDown={toggleOpenKeyDown}
			>
				<div className={classes['label-name-container']}>
					<svg
						className={classes['label-icon']}
						style={{ marginRight: '0.25rem' }}
					>
						<use xlinkHref={`/Icons.svg#${spell.school.index}`} />
					</svg>{' '}
					{spell.name}
					{isSelected && <CheckIcon className={classes.check} />}
				</div>
				{isOpen ? (
					<ChevronUpIcon className={classes['label-icon']} />
				) : (
					<ChevronDownIcon className={classes['label-icon']} />
				)}
			</div>
			<div
				className={classes['selector-display']}
				style={{ display: isOpen ? 'grid' : 'none' }}
			>
				<div className={classes.summary}>
					<div className={classes['summary-item']}>
						<span className={classes['summary-item-label']}>Level</span>:{' '}
						{spell.level === 0 ? 'Cantrip' : spell.level}
					</div>
					<div className={classes['summary-item']}>
						<span className={classes['summary-item-label']}>Casting time</span>:{' '}
						{spell.casting_time}
					</div>
					<div className={classes['summary-item']}>
						<span className={classes['summary-item-label']}>Range</span>:{' '}
						{spell.range}
					</div>
					<div className={classes['summary-item']}>
						<span className={classes['summary-item-label']}>Components</span>:{' '}
						{spell.components.join(', ')}
						{spell.material ? ` (${spell.material})` : ''}
					</div>
				</div>
				<div className={classes.description}>
					{spell.desc.map((desc, index) => (
						<p key={`${item ? `${item.index}` : ''}${spell.name}-${index}`}>
							{desc}
						</p>
					))}
				</div>
				<div className={classes.other}>
					{spell.concentration && (
						<p className={classes['other-info']}>Requires concentration.</p>
					)}
					{spell.ritual && (
						<p className={classes['other-info']}>Can be cast as a ritual.</p>
					)}
					{spell.damage && spell.damage.damage_type && (
						<div className={classes['damage-display']}>
							<div>
								<span className={classes['summary-item-label']}>
									Damage type
								</span>
								: {spell.damage.damage_type.name}
							</div>
							<svg className={classes['damage-icon']}>
								<use
									xlinkHref={`/Icons.svg#${spell.damage.damage_type.index}`}
								/>
							</svg>
						</div>
					)}
				</div>
				<div className={classes.buttons}>
					<Button
						positive
						size={isMediumOrLarger ? 'medium' : 'small'}
						onClick={onAdd}
						disabled={isSelected || !selectValues.includes('blank')}
					>
						Add
					</Button>
					<Button
						onClick={onRemove}
						size={isMediumOrLarger ? 'medium' : 'small'}
						disabled={!isSelected}
					>
						Remove
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SpellSelector;
