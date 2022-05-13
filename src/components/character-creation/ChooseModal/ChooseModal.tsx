import { KeyboardEventHandler, ReactNode, useCallback } from 'react';

import classes from './ChooseModal.module.css';

type ChooseModalProps = {
	show: boolean;
	mainContent: ReactNode;
	onClose: () => void;
	onChoose: () => void;
};

const ChooseModal = ({
	show,
	mainContent,
	onClose,
	onChoose
}: ChooseModalProps): JSX.Element => {
	const onCloseKeyUp: KeyboardEventHandler<HTMLDivElement> = useCallback(
		event => {
			if (event.code === 'Enter') {
				onClose();
			}
		},
		[onClose]
	);

	const onChooseKeyUp: KeyboardEventHandler<HTMLDivElement> = useCallback(
		event => {
			if (event.code === 'Enter') {
				onChoose();
			}
		},
		[onChoose]
	);

	return (
		<div
			style={{ display: show ? 'flex' : 'none' }}
			className={classes['modal-container']}
		>
			<div className={classes.modal}>
				<div className={classes['icon-container']}></div>
				<div className={classes['content-container']}>{mainContent}</div>
				<div className={classes['buttons-container']}>
					<div
						className={`${classes.button} ${classes.choose}`}
						tabIndex={0}
						aria-label="Choose"
						onClick={onChoose}
						onKeyUp={onChooseKeyUp}
					>
						Choose
					</div>
					<div
						className={`${classes.button} ${classes.cancel}`}
						tabIndex={0}
						aria-label="Cancel"
						onClick={onClose}
						onKeyUp={onCloseKeyUp}
					>
						Cancel
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChooseModal;
