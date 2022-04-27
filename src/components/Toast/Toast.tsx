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
		<div className={getClassName()}>
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
					<h1 className={classes['toast-title']}>Error</h1>
				) : (
					<h1 className={classes['toast-title']}>Success!</h1>
				)}
				<p className={classes.message}>{cleanMessage(message)}</p>
			</div>
			<div className={classes['x-container']}>
				<XIcon className={classes['x-icon']} onClick={hideToast} />
			</div>
		</div>
	);
};

export default Toast;
