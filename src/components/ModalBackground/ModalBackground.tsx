'use client';

import { PropsWithChildren } from 'react';
import classes from './ModalBackground.module.css';

type ModalBackgroundProps = {
	show: boolean;
	testId?: string;
};

const ModalBackground = ({
	show,
	testId,
	children
}: PropsWithChildren<ModalBackgroundProps>) => (
	<div
		style={{ display: show ? 'flex' : 'none' }}
		className={classes['modal-container']}
		data-testid={testId}
	>
		{children}
	</div>
);

export default ModalBackground;
