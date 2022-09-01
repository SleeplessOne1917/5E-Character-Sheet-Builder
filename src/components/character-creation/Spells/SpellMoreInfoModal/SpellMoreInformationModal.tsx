import { useEffect, useRef } from 'react';

import Button from '../../../Button/Button';
import { SrdSpellItem } from '../../../../types/srd';
import { XCircleIcon } from '@heroicons/react/24/solid';
import classes from './SpellMoreInformationModal.module.css';
import ModalBackground from '../../../ModalBackground/ModalBackground';
import MarkdownParser from '../../../MarkdownParser/MarkdownParser';

type SpellMoreInformationModalProps = {
	show: boolean;
	spell?: SrdSpellItem;
	onClose: () => void;
};

const SpellMoreInformationModal = ({
	show,
	spell,
	onClose
}: SpellMoreInformationModalProps) => {
	const closeButtonRef = useRef<HTMLButtonElement>();

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
						<use xlinkHref={`/Icons.svg#${spell?.school.index}`} />
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
						ref={closeButtonRef}
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
							: {spell?.casting_time}
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
					</div>
					<div className={classes.description}>
						<MarkdownParser input={spell?.desc ?? ''} />
						{spell?.higher_level &&
							spell.higher_level.map((hl, index) => (
								<p key={`${spell.index}-higher-level-${index}`}>
									{index === 0 && (
										<span className={classes['summary-item-label']}>
											At Higher Levels:{' '}
										</span>
									)}
									{hl}
								</p>
							))}
					</div>
					<div className={classes.other}>
						{spell?.concentration && (
							<p className={classes['other-info']}>Requires concentration.</p>
						)}
						{spell?.ritual && (
							<p className={classes['other-info']}>Can be cast as a ritual.</p>
						)}
						{spell?.damage && spell.damage.damage_type && (
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
				</div>
			</div>
		</ModalBackground>
	);
};

export default SpellMoreInformationModal;
