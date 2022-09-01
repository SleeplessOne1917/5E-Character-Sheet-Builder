import { KeyboardEventHandler, useCallback, useState } from 'react';

import { HeartIcon } from '@heroicons/react/24/solid';
import HitPointsModal from '../HitPointsModal/HitPointsModal';
import classes from './HitPointsButton.module.css';
import { handleKeyDownEvent } from '../../../services/handlerService';
import useHP from '../../../hooks/useHP';

const HitPointsButton = () => {
	const [showModal, setShowModal] = useState(false);
	const hp = useHP();

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
				}${hp !== null ? ` ${classes.selected}` : ''}`}
				tabIndex={0}
				role="button"
				aria-label="Set Hit Points"
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				<HeartIcon className={classes['hp-icon']} />
				<div className={classes.hp}>{hp !== null ? hp : '\u2014'} HP</div>
			</div>
			<HitPointsModal show={showModal} onClose={handleClose} />
		</div>
	);
};

export default HitPointsButton;
