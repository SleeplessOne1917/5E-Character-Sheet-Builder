import {
	CheckCircleIcon,
	ExclaimationCircleIcon,
	XMarkIcon
} from '@heroicons/react/24/solid';
import { KeyboardEventHandler, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';

import { ToastType } from '../../types/toast';
import classes from './Toast.module.css';
import { cleanMessage } from '../../services/messageCleanerService';
import { handleKeyDownEvent } from '../../services/handlerService';
import { hide } from '../../redux/features/toast';

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

	const hideToastKeyDown: KeyboardEventHandler<SVGSVGElement> = useCallback(
		event => {
			handleKeyDownEvent<SVGSVGElement>(event, hideToast);
		},
		[hideToast]
	);

	return (
		<div className={getClassName()} aria-label="toast" role="alert">
			<div className={classes['icon-container']}>
				{type === ToastType.error ? (
					<ExclaimationCircleIcon
						className={`${classes.icon} ${classes['error-icon']}`}
						role="img"
						aria-hidden="false"
						aria-label="Error"
					/>
				) : (
					<CheckCircleIcon
						className={`${classes.icon} ${classes['success-icon']}`}
						role="img"
						aria-hidden="false"
						aria-label="Success"
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
				<XMarkIcon
					className={classes['x-icon']}
					onKeyDown={hideToastKeyDown}
					onClick={hideToast}
					tabIndex={isOpen ? 0 : -1}
					aria-hidden="false"
					aria-label="Close toast"
					role="button"
				/>
			</div>
		</div>
	);
};

export default Toast;
