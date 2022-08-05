import { CSSProperties, ReactNode } from 'react';
import Button from '../../Button/Button';

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
	const buttonStyle: CSSProperties = {
		flexGrow: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: '2rem',
		border: 0,
		margin: 0,
		borderRadius: 0
	};

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
					<Button onClick={onChoose} positive style={buttonStyle}>
						Choose
					</Button>
					<Button onClick={onClose} style={buttonStyle}>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ChooseModal;
