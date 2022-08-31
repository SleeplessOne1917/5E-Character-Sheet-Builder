import {
	calculateModifier,
	getTotalScore
} from '../../../services/abilityScoreService';

import Button from '../../Button/Button';
import ModalBackground from '../../ModalBackground/ModalBackground';
import RadioButton from '../../RadioButton/RadioButton';
import { XCircleIcon } from '@heroicons/react/24/solid';
import classes from './HitPointsModal.module.css';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { useState } from 'react';

type HitPointsModalProps = {
	show: boolean;
	onClose: () => void;
};

const HitPointsModal = ({ show, onClose }: HitPointsModalProps) => {
	const constitution = useAppSelector(
		state => state.editingCharacter.abilityScores.con
	);
	const hitDie = useAppSelector(
		state => state.editingCharacter.classInfo.class?.hit_die
	);

	const [autoLevel, setAutoLevel] = useState<'off' | 'roll' | 'average'>('off');

	const conModifier = constitution.base
		? calculateModifier(getTotalScore(constitution))
		: null;

	return (
		<ModalBackground testId="hit-points-modal" show={show}>
			<div className={classes.modal}>
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
				<div className={classes['bonuses-container']}>
					{conModifier !== null && conModifier !== 0 && (
						<>
							<div className={classes['section-header']}>Bonuses per level</div>
							<div className={classes.bonuses}>
								{conModifier !== null && conModifier !== 0 && (
									<div className={classes.bonus}>
										<span className={classes['bonus-label']}>
											Constitution Bonus:
										</span>{' '}
										{conModifier >= 0 ? '+' : '-'}
										{Math.abs(conModifier)}
									</div>
								)}
							</div>
						</>
					)}
				</div>
				<div className={classes['auto-level-container']}>
					<div className={classes['section-header']}>
						Automatically add HP on level up
					</div>
					<div className={classes['auto-level-radios']} role="radiogroup">
						<RadioButton
							selected={autoLevel}
							value="off"
							onChange={value => setAutoLevel(value as 'off')}
							labelText="Off"
						/>
						<RadioButton
							selected={autoLevel}
							value="roll"
							onChange={value => setAutoLevel(value as 'roll')}
							labelText="Roll Hit Die"
						/>

						<RadioButton
							selected={autoLevel}
							value="average"
							onChange={value => setAutoLevel(value as 'average')}
							labelText="Average Hit Die Roll"
						/>
					</div>
				</div>
				<div className={classes['hp-container']}>
					{!hitDie ? (
						<div className={classes['no-class-message']}>
							Must select class to calculate HP.
						</div>
					) : (
						<div></div>
					)}
				</div>
			</div>
		</ModalBackground>
	);
};

export default HitPointsModal;
