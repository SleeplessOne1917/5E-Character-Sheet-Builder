import {
	CheckCircleIcon,
	ExclamationCircleIcon,
	XIcon
} from '@heroicons/react/solid';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { useCallback, useEffect } from 'react';

import { ToastType } from '../../types/toast';
import classes from './Toast.module.css';
import { hide } from '../../redux/features/toast';

const cleanMessage = (message: string) => {
	const regexResult = /(?:\[GraphQL\] )?(.*)/.exec(message);

	if (regexResult && regexResult[1]) {
		return regexResult[1];
	} else {
		return '';
	}
};

const Toast = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const { message, closeTimeoutSeconds, isOpen, type } = useAppSelector(
		state => state.toast
	);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isOpen) {
			timer = setTimeout(hideToast, closeTimeoutSeconds * 1000);
		}
		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [isOpen, closeTimeoutSeconds]); //eslint-disable-line

	const getClassName = useCallback(() => {
		return `${classes.toast} ${
			type === ToastType.error
				? classes['toast-error']
				: classes['toast-success']
		}${isOpen ? ` ${classes.open}` : ''}`;
	}, [isOpen, type]);

	const hideToast = useCallback(() => dispatch(hide()), [dispatch]);

	return (
		<div className={getClassName()} aria-label="toast" role="region">
			<div className={classes['icon-container']}>
				{type === ToastType.error ? (
					<ExclamationCircleIcon
						className={`${classes.icon} ${classes['error-icon']}}`}
					/>
				) : (
					<CheckCircleIcon
						className={`${classes.icon} ${classes['success-icon']}`}
					/>
				)}
			</div>
			<div className={classes['toast-text']}>
				{type === ToastType.error ? (
					<div className={classes['toast-title']}>Error</div>
				) : (
					<div className={classes['toast-title']}>Success!</div>
				)}
				<p className={classes.message}>{cleanMessage(message)}</p>
			</div>
			<div className={classes['x-container']}>
				<XIcon
					className={classes['x-icon']}
					onClick={hideToast}
					tabIndex={isOpen ? 0 : -1}
					aria-hidden="false"
					aria-label="Close toast"
				/>
			</div>
		</div>
	);
};

export default Toast;
