'use client';

import Toast from './Toast';
import classes from './ToastContainer.module.css';

const ToastContainer = (): JSX.Element => {
	return (
		<div className={classes['toast-container']}>
			<Toast />
		</div>
	);
};

export default ToastContainer;
