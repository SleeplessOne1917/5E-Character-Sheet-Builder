import { ReactNode } from 'react';

import classes from './ChooseModal.module.css';

export type ChooseModalProps = {
	show: boolean;
	mainContent: ReactNode;
	onClose: () => void;
	onChoose: () => void;
	iconId: string;
};

// TODO: Automatically tab to modal

const ChooseModal = ({
	show,
	mainContent,
	onClose,
	onChoose,
	iconId
}: ChooseModalProps): JSX.Element => {
	return (
		<div
			style={{ display: show ? 'flex' : 'none' }}
			className={classes['modal-container']}
			data-testid="choose-modal"
		>
			<div className={classes.modal}>
				<div className={classes['icon-container']}>
					<svg className={classes.icon}>
						<use xlinkHref={`/Icons.svg#${iconId}`} />
					</svg>
				</div>
				<div className={classes['content-container']}>{mainContent}</div>
				<div className={classes['buttons-container']}>
					<button
						className={`${classes.button} ${classes.choose}`}
						onClick={onChoose}
					>
						Choose
					</button>
					<button
						className={`${classes.button} ${classes.cancel}`}
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChooseModal;
