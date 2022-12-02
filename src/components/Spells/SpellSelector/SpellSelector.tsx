'use client';

import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon
} from '@heroicons/react/20/solid';
import {
	KeyboardEventHandler,
	memo,
	useCallback,
	useMemo,
	useState
} from 'react';

import Button from '../../Button/Button';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { SpellItem } from '../../../types/characterSheetBuilderAPI';
import { SrdItem } from '../../../types/srd';
import classes from './SpellSelector.module.css';
import dynamic from 'next/dynamic';
import { handleKeyDownEvent } from '../../../services/handlerService';
import useGetSpell from '../../../hooks/useGetSpell';
import useMediaQuery from '../../../hooks/useMediaQuery';

const MarkdownParser = dynamic(
	() => import('../../MarkdownParser/MarkdownParser'),
	{
		loading: () => (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<LoadingSpinner />
			</div>
		)
	}
);

type SpellSelectorProps = {
	spell: SpellItem;
	item?: SrdItem;
	onAdd: () => void;
	onRemove: () => void;
	selectValues: string[];
	parentSelected?: boolean;
};

const SpellSelector = ({
	spell,
	item,
	onAdd,
	onRemove,
	selectValues,
	parentSelected = false
}: SpellSelectorProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const isMediumOrLarger = useMediaQuery('(min-width: 768px)');
	const isSelected = useMemo(
		() => selectValues.includes(spell.id),
		[selectValues, spell.id]
	);

	const spellResult = useGetSpell(spell.id, { paused: !isOpen });

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
		<div
			className={`${classes.selector}${
				isSelected ? ` ${classes.selected}` : ''
			}`}
			data-testid="spell-selector"
		>
			<div
				className={classes['selector-label']}
				role="button"
				tabIndex={0}
				aria-label={`${item ? `${item?.name} ` : ''}${spell.name}`}
				onClick={toggleOpen}
				onKeyDown={toggleOpenKeyDown}
			>
				<div className={classes['label-name-container']}>
					<svg className={classes['label-icon']}>
						<use xlinkHref={`/Icons.svg#${spell.school.id}`} />
					</svg>
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
				{spellResult.fetching && (
					<div className={classes.loading}>
						<LoadingSpinner />
					</div>
				)}
				{!spellResult.fetching && (
					<>
						<div className={classes.summary}>
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>Level</span>:{' '}
								{spellResult.spell?.level === 0
									? 'Cantrip'
									: spellResult.spell?.level}
							</div>
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>
									Casting time
								</span>
								: {spellResult.spell?.castingTime}
							</div>
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>Duration</span>:{' '}
								{spellResult.spell?.duration}
							</div>
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>Range</span>:{' '}
								{spellResult.spell?.range}
							</div>
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>School</span>:{' '}
								{spellResult.spell?.school.name}
							</div>
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>
									Components
								</span>
								: {spellResult.spell?.components.join(', ')}
								{spellResult.spell?.material
									? ` (${spellResult.spell.material})`
									: ''}
							</div>
						</div>
						<div className={classes.description}>
							<MarkdownParser input={spellResult.spell?.description ?? ''} />
							{spellResult.spell?.atHigherLevels && (
								<MarkdownParser
									input={
										'**At Higher Levels**: ' + spellResult.spell.atHigherLevels
									}
								/>
							)}
						</div>
						<div className={classes.other}>
							{spellResult.spell?.concentration && (
								<p className={classes['other-info']}>Requires concentration.</p>
							)}
							{spellResult.spell?.ritual && (
								<p className={classes['other-info']}>
									Can be cast as a ritual.
								</p>
							)}
							{spellResult.spell?.damageType && (
								<div className={classes['damage-display']}>
									<div>
										<span className={classes['summary-item-label']}>
											Damage type
										</span>
										: {spellResult.spell?.damageType.name}
									</div>
									<svg className={classes['damage-icon']}>
										<use
											xlinkHref={`/Icons.svg#${spellResult.spell?.damageType.id}`}
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
								disabled={isSelected || parentSelected}
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
					</>
				)}
			</div>
		</div>
	);
};

export default memo(SpellSelector);
