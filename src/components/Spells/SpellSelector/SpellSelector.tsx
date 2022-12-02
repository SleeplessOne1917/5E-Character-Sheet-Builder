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
	useEffect,
	useMemo,
	useState
} from 'react';
import { Spell, SpellItem } from '../../../types/characterSheetBuilderAPI';

import Button from '../../Button/Button';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { SrdItem } from '../../../types/srd';
import classes from './SpellSelector.module.css';
import dynamic from 'next/dynamic';
import { getSpell } from '../../../services/spellsService';
import { handleKeyDownEvent } from '../../../services/handlerService';
import { isObjectId } from '../../../services/objectIdService';
import { trpc } from '../../../common/trpcNext';
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
	const [isLoadingSrdSpells, setIsLoadingSrdSpells] = useState(false);
	const [fullSpell, setFullSpell] = useState<Spell>();
	const isMediumOrLarger = useMediaQuery('(min-width: 768px)');
	const isSelected = useMemo(
		() => selectValues.includes(spell.id),
		[selectValues, spell.id]
	);
	const isCustomSpell = isObjectId(spell.id);

	const customSpellResult = trpc.spells.spell.useQuery(spell.id, {
		enabled: isOpen && isCustomSpell
	});

	useEffect(() => {
		if (isOpen && !fullSpell) {
			if (isCustomSpell && customSpellResult.isSuccess) {
				setFullSpell(customSpellResult.data);
			} else if (!isCustomSpell) {
				setIsLoadingSrdSpells(true);
				getSpell(spell.id).then(sp => {
					setFullSpell(sp);
					setIsLoadingSrdSpells(false);
				});
			}
		}
	}, [
		isOpen,
		fullSpell,
		isCustomSpell,
		customSpellResult.data,
		customSpellResult.isSuccess,
		spell.id
	]);

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

	const isLoading = isLoadingSrdSpells || customSpellResult.isFetching;

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
				{isLoading && (
					<div className={classes.loading}>
						<LoadingSpinner />
					</div>
				)}
				{!isLoading && (
					<>
						<div className={classes.summary}>
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>Level</span>:{' '}
								{fullSpell?.level === 0 ? 'Cantrip' : fullSpell?.level}
							</div>
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>
									Casting time
								</span>
								: {fullSpell?.castingTime}
							</div>
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>Duration</span>:{' '}
								{fullSpell?.duration}
							</div>
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>Range</span>:{' '}
								{fullSpell?.range}
							</div>
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>School</span>:{' '}
								{fullSpell?.school.name}
							</div>
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>
									Components
								</span>
								: {fullSpell?.components.join(', ')}
								{fullSpell?.material ? ` (${fullSpell.material})` : ''}
							</div>
						</div>
						<div className={classes.description}>
							<MarkdownParser input={fullSpell?.description ?? ''} />
							{fullSpell?.atHigherLevels && (
								<MarkdownParser
									input={'**At Higher Levels**: ' + fullSpell.atHigherLevels}
								/>
							)}
						</div>
						<div className={classes.other}>
							{fullSpell?.concentration && (
								<p className={classes['other-info']}>Requires concentration.</p>
							)}
							{fullSpell?.ritual && (
								<p className={classes['other-info']}>
									Can be cast as a ritual.
								</p>
							)}
							{fullSpell?.damageType && (
								<div className={classes['damage-display']}>
									<div>
										<span className={classes['summary-item-label']}>
											Damage type
										</span>
										: {fullSpell?.damageType.name}
									</div>
									<svg className={classes['damage-icon']}>
										<use xlinkHref={`/Icons.svg#${fullSpell?.damageType.id}`} />
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
