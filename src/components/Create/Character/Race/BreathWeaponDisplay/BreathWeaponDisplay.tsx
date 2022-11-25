'use client';

import { BreathWeapon } from '../../../../../types/srd';
import classes from './BreathWeaponDisplay.module.css';

type BreathWeaponDisplayProps = {
	breathWeapon: BreathWeapon;
};

const BreathWeaponDisplay = ({ breathWeapon }: BreathWeaponDisplayProps) => {
	return (
		<div
			data-testid="breath-weapon"
			className={classes['breath-weapon-container']}
		>
			<div className={classes.title}>Breath Weapon</div>
			<div className={classes['breath-weapon']}>
				<div className={classes['icon-container']}>
					<svg className={classes.icon}>
						<use
							xlinkHref={`/Icons.svg#${breathWeapon.damage[0].damage_type.index}`}
						/>
					</svg>
				</div>
				<div className={classes.content}>
					<div>
						<span className={classes['breath-weapon-label']}>Damage type</span>:{' '}
						<span className={classes['breath-weapon-data']}>
							{breathWeapon.damage[0].damage_type.name}
						</span>
					</div>
					<div>
						<span className={classes['breath-weapon-label']}>Damage</span>:{' '}
						<span className={classes['breath-weapon-data']}>
							{
								breathWeapon.damage[0].damage_at_character_level.find(
									item => item.level === 1
								)?.damage
							}
						</span>
					</div>
					<div>
						<span className={classes['breath-weapon-label']}>Saving throw</span>
						:{' '}
						<span className={classes['breath-weapon-data']}>
							{breathWeapon.dc.type.full_name}
						</span>
					</div>
					<div className={classes['area-of-effect']}>
						<div>
							<span className={classes['breath-weapon-label']}>
								Area of effect
							</span>
							:{' '}
							<span className={classes['breath-weapon-data']}>
								{`${
									breathWeapon.area_of_effect.size
								} ft. ${breathWeapon.area_of_effect.type.toLowerCase()}`}
							</span>
						</div>
						<svg className={classes.shape}>
							<use
								xlinkHref={`/Icons.svg#${breathWeapon.area_of_effect.type.toLowerCase()}`}
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BreathWeaponDisplay;
