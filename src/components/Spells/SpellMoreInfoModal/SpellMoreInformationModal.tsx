import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

import Button from '../../Button/Button';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import ModalBackground from '../../ModalBackground/ModalBackground';
import { Spell } from '../../../types/characterSheetBuilderAPI';
import { XCircleIcon } from '@heroicons/react/24/solid';
import classes from './SpellMoreInformationModal.module.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

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

type SpellMoreInformationModalProps = {
	shouldShowEditAndClasses?: boolean;
	show: boolean;
	spell?: Spell;
	onClose: () => void;
};

const SpellMoreInformationModal = ({
	show,
	spell,
	onClose,
	shouldShowEditAndClasses = false
}: SpellMoreInformationModalProps) => {
	const closeButtonRef = useRef<HTMLButtonElement>();
	const router = useRouter();

	const handleEditClick = useCallback(() => {
		router.push(`/my-stuff/edit/spells/${spell?.id}`);
	}, [router, spell?.id]);

	useEffect(() => {
		if (show) {
			closeButtonRef.current?.focus();
		}
	}, [show]);

	return (
		<ModalBackground testId="spell-more-information-modal" show={show}>
			<div className={classes.modal}>
				<div className={classes['title-container']}>
					<svg className={classes['title-icon']}>
						<use xlinkHref={`/Icons.svg#${spell?.school.id}`} />
					</svg>
					<h3>{spell?.name}</h3>
				</div>
				<div className={classes['close-container']}>
					<Button
						onClick={onClose}
						style={{
							display: 'flex',
							alignItems: 'center'
						}}
						ref={closeButtonRef as MutableRefObject<HTMLButtonElement>}
					>
						<XCircleIcon className={classes['close-icon']} />
						Close
					</Button>
				</div>
				<div className={classes['content-container']}>
					<div className={classes.summary}>
						<div className={classes['summary-item']}>
							<span className={classes['summary-item-label']}>Level</span>:{' '}
							{spell?.level === 0 ? 'Cantrip' : spell?.level}
						</div>
						<div className={classes['summary-item']}>
							<span className={classes['summary-item-label']}>
								Casting time
							</span>
							: {spell?.castingTime}
						</div>
						<div className={classes['summary-item']}>
							<span className={classes['summary-item-label']}>Duration</span>:{' '}
							{spell?.duration}
						</div>
						<div className={classes['summary-item']}>
							<span className={classes['summary-item-label']}>Range</span>:{' '}
							{spell?.range}
						</div>
						<div className={classes['summary-item']}>
							<span className={classes['summary-item-label']}>School</span>:{' '}
							{spell?.school.name}
						</div>
						<div className={classes['summary-item']}>
							<span className={classes['summary-item-label']}>Components</span>:{' '}
							{spell?.components.join(', ')}
							{spell?.material ? ` (${spell.material})` : ''}
						</div>
						{shouldShowEditAndClasses && (
							<div className={classes['summary-item']}>
								<span className={classes['summary-item-label']}>Classes</span>:{' '}
								{spell?.classes.map(({ name }) => name).join(', ')}
							</div>
						)}
					</div>
					<div className={classes.description}>
						<MarkdownParser input={spell?.description ?? ''} />
						{spell?.atHigherLevels && (
							<MarkdownParser
								input={'**At Higher Levels**: ' + spell.atHigherLevels}
							/>
						)}
					</div>
					<div className={classes.other}>
						{spell?.concentration && (
							<p className={classes['other-info']}>Requires concentration.</p>
						)}
						{spell?.ritual && (
							<p className={classes['other-info']}>Can be cast as a ritual.</p>
						)}
						{spell?.damageType && (
							<div className={classes['damage-display']}>
								<div>
									<span className={classes['summary-item-label']}>
										Damage type
									</span>
									: {spell.damageType?.name}
								</div>
								<svg className={classes['damage-icon']}>
									<use xlinkHref={`/Icons.svg#${spell.damageType?.id}`} />
								</svg>
							</div>
						)}
						{shouldShowEditAndClasses && (
							<Button
								positive
								onClick={handleEditClick}
								style={{ width: '80%' }}
							>
								Edit
							</Button>
						)}
					</div>
				</div>
			</div>
		</ModalBackground>
	);
};

export default SpellMoreInformationModal;
