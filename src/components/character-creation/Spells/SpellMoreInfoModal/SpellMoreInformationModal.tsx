import { XCircleIcon } from '@heroicons/react/24/solid';
import { SrdSpellItem } from '../../../../types/srd';
import Button from '../../../Button/Button';
import classes from './SpellMoreInformationModal.module.css';

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
	return (
		<div
			className={classes['modal-container']}
			data-testid="spell-more-information-modal"
			style={{ display: show ? 'flex' : 'none' }}
		>
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
							<span className={classes['summary-item-label']}>Range</span>:{' '}
							{spell?.range}
						</div>
						<div className={classes['summary-item']}>
							<span className={classes['summary-item-label']}>Components</span>:{' '}
							{spell?.components.join(', ')}
							{spell?.material ? ` (${spell.material})` : ''}
						</div>
					</div>
					<div className={classes.description}>
						{spell?.desc.map((desc, index) => (
							<p key={`${spell.name}-${index}`}>{desc}</p>
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
		</div>
	);
};

export default SpellMoreInformationModal;