import { CSSProperties, useEffect, useRef } from 'react';

import Button from '../Button/Button';
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon';
import classes from './ConfirmationModal.module.css';

type ConfirmationModalProps = {
	show: boolean;
	onYes: () => void;
	onNo: () => void;
	message: string;
};

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

const ConfirmationModal = ({
	show,
	onYes,
	onNo,
	message
}: ConfirmationModalProps): JSX.Element => {
	const yesRef = useRef<HTMLButtonElement>();

	useEffect(() => {
		if (show) {
			yesRef.current?.focus();
		}
	}, [show]);

	return (
		<div
			className={classes['modal-container']}
			data-testid="confirmation-modal"
			style={{ display: show ? 'flex' : 'none' }}
		>
			<div className={classes.modal}>
				<div className={classes.content}>
					<ExclamationTriangleIcon className={classes.icon} /> {message}
				</div>
				<div className={classes.buttons}>
					<Button positive style={buttonStyle} onClick={onYes} ref={yesRef}>
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
