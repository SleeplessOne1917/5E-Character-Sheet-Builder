import { CSSProperties } from 'react';
import Button from '../Button/Button';
import classes from './ConfirmationModal.module.css';
import { ExclamationIcon } from '@heroicons/react/outline';

type ConfirmationModalProps = {
	show: boolean;
	onYes: () => void;
	onNo: () => void;
	message: string;
};

const ConfirmationModal = ({
	show,
	onYes,
	onNo,
	message
}: ConfirmationModalProps): JSX.Element => {
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
			className={classes['modal-container']}
			data-testid="confirmation-modal"
			style={{ display: show ? 'flex' : 'none' }}
		>
			<div className={classes.modal}>
				<div className={classes.content}>
					<ExclamationIcon className={classes.icon} /> {message}
				</div>
				<div className={classes.buttons}>
					<Button positive style={buttonStyle} onClick={onYes}>
						Yes
					</Button>
					<Button style={buttonStyle} onClick={onNo}>
						No
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
