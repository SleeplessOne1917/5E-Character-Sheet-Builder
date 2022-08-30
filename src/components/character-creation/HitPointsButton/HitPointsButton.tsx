import { HeartIcon } from '@heroicons/react/24/solid';
import classes from './HitPointsButton.module.css';

const HitPointsButton = () => {
	return (
		<div
			className={classes['hp-container']}
			tabIndex={0}
			role="button"
			aria-label="Set Hit Points"
		>
			<HeartIcon className={classes['hp-icon']} />
			<div className={classes.hp}>&mdash; HP</div>
		</div>
	);
};

export default HitPointsButton;
