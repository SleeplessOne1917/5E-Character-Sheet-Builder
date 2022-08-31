import { KeyboardEventHandler, useCallback, useState } from 'react';

import { HeartIcon } from '@heroicons/react/24/solid';
import HitPointsModal from '../HitPointsModal/HitPointsModal';
import classes from './HitPointsButton.module.css';
import { handleKeyDownEvent } from '../../../services/handlerService';

const HitPointsButton = () => {
	const [showModal, setShowModal] = useState(false);

	const handleClick = useCallback(() => {
		setShowModal(true);
	}, [setShowModal]);

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
		e => {
			handleKeyDownEvent(e, handleClick);
		},
		[handleClick]
	);

	const handleClose = useCallback(() => {
		setShowModal(false);
	}, [setShowModal]);

	return (
		<div data-testid="hit-points-button" className={classes.wrapper}>
			<div
				className={`${classes['hp-container']}${
					showModal ? ` ${classes.open}` : ''
				}`}
				tabIndex={0}
				role="button"
				aria-label="Set Hit Points"
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				<HeartIcon className={classes['hp-icon']} />
				<div className={classes.hp}>&mdash; HP</div>
			</div>
			<HitPointsModal show={showModal} onClose={handleClose} />
		</div>
	);
};

export default HitPointsButton;
