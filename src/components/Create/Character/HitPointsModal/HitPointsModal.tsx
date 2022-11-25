'use client';

import { CSSProperties, useCallback } from 'react';
import {
	calculateModifier,
	getTotalScore
} from '../../../../services/abilityScoreService';
import {
	setAutoLevel as createSetAutoLevelAction,
	setLevelHpBonus
} from '../../../../redux/features/hp';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';

import { AutoLevelType } from '../../../../redux/features/hp';
import Button from '../../../Button/Button';
import ModalBackground from '../../../ModalBackground/ModalBackground';
import RadioButton from '../../../RadioButton/RadioButton';
import { XCircleIcon } from '@heroicons/react/24/solid';
import classes from './HitPointsModal.module.css';
import { getOrdinal } from '../../../../services/ordinalService';
import { rollDie } from '../../../../services/diceService';
import useHP from '../../../../hooks/useHP';

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
	const dispatch = useAppDispatch();
	const { autoLevel, levelHPBonuses } = useAppSelector(
		state => state.editingCharacter.hp
	);

	const conModifier = constitution.base
		? calculateModifier(getTotalScore(constitution))
		: null;

	const hpModifier = conModifier ?? 0;

	const handleAddAverage = useCallback(
		(index: number) => {
			dispatch(setLevelHpBonus({ index, bonus: (hitDie as number) / 2 + 1 }));
		},
		[dispatch, hitDie]
	);

	const handleAddRoll = useCallback(
		(index: number) => {
			dispatch(
				setLevelHpBonus({
					index,
					bonus: rollDie(hitDie as number)
				})
			);
		},
		[dispatch, hitDie]
	);

	const handleResetBonus = useCallback(
		(index: number) => {
			dispatch(setLevelHpBonus({ index, bonus: null }));
		},
		[dispatch]
	);

	const handleResetAllBonuses = useCallback(() => {
		levelHPBonuses.forEach((_, index) => {
			dispatch(setLevelHpBonus({ index, bonus: null }));
		});
	}, [dispatch, levelHPBonuses]);

	const setAutoLevel = useCallback(
		(value: AutoLevelType) => {
			dispatch(createSetAutoLevelAction(value));

			if (value === 'average') {
				for (let i = 0; i < levelHPBonuses.length; ++i) {
					if (levelHPBonuses[i] === null) {
						handleAddAverage(i);
					}
				}
			}

			if (value === 'roll') {
				for (let i = 0; i < levelHPBonuses.length; ++i) {
					if (levelHPBonuses[i] === null) {
						handleAddRoll(i);
					}
				}
			}
		},
		[dispatch, handleAddAverage, handleAddRoll, levelHPBonuses]
	);

	const hp = useHP();

	const buttonStyle: CSSProperties = { padding: '0.5rem' };

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
					<div style={{ alignSelf: 'flex-start' }}>
						<div className={classes['section-header']}>
							Automatically add HP on level up
						</div>
						<div className={classes['auto-level-radios']} role="radiogroup">
							<RadioButton
								selected={autoLevel}
								value="off"
								onChange={value => setAutoLevel(value as AutoLevelType)}
								labelText="Off"
							/>
							<RadioButton
								selected={autoLevel}
								value="roll"
								onChange={value => setAutoLevel(value as AutoLevelType)}
								labelText="Roll Hit Die"
							/>
							<RadioButton
								selected={autoLevel}
								value="average"
								onChange={value => setAutoLevel(value as AutoLevelType)}
								labelText="Average Hit Die Roll"
							/>
						</div>
					</div>
					{autoLevel === 'off' && (
						<Button
							onClick={handleResetAllBonuses}
							style={{ width: 'fit-content' }}
						>
							Reset All Level Bonuses
						</Button>
					)}
				</div>
				<div className={classes['hp-container']}>
					{!hitDie ? (
						<div className={classes['no-class-message']}>
							Must select class to calculate HP.
						</div>
					) : (
						<div className={classes.hp}>
							<div className={classes['hp-section-header']}>
								<div>HP by level</div>
								<div>Hit Die: d{hitDie}</div>
								<div>HP: {hp !== null ? hp : '\u2014'}</div>
							</div>
							<div className={classes['hp-levels']}>
								<div className={classes['hp-level']}>
									<div className={classes['hp-level-start']}>
										<div className={classes['hp-level-label']}>1st</div>
										<div className={classes['hp-level-hp']}>
											{hitDie}
											{hpModifier
												? ` ${hpModifier >= 0 ? '+' : '-'}${Math.abs(
														hpModifier
												  )}`
												: ''}
										</div>
									</div>
								</div>
								{levelHPBonuses.length > 0 &&
									levelHPBonuses.map((bonus, index) => (
										<div className={classes['hp-level']} key={index}>
											<div className={classes['hp-level-start']}>
												<div className={classes['hp-level-label']}>
													{getOrdinal(index + 2)}
												</div>
												<div className={classes['hp-level-hp']}>
													{bonus ?? '?'}
													{hpModifier
														? ` ${hpModifier >= 0 ? '+' : '-'}${Math.abs(
																hpModifier
														  )}`
														: ''}
												</div>
											</div>
											{autoLevel === 'off' && (
												<div className={classes['hp-buttons']}>
													{bonus ? (
														<Button
															size="small"
															onClick={() => handleResetBonus(index)}
															style={buttonStyle}
														>
															Clear Level
														</Button>
													) : (
														<>
															<Button
																size="small"
																positive
																onClick={() => handleAddRoll(index)}
																style={buttonStyle}
															>
																Add 1d{hitDie}
															</Button>
															<Button
																size="small"
																positive
																onClick={() => handleAddAverage(index)}
																style={buttonStyle}
															>
																Add Average ({hitDie / 2 + 1})
															</Button>
														</>
													)}
												</div>
											)}
										</div>
									))}
							</div>
						</div>
					)}
				</div>
			</div>
		</ModalBackground>
	);
};

export default HitPointsModal;
