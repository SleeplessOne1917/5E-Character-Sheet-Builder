import { MouseEventHandler, ReactNode, memo } from 'react';

import classes from './BigButton.module.css';

export enum ButtonType {
	button = 'button',
	submit = 'submit'
}

type ButtonProps = {
	disabled?: boolean;
	type?: ButtonType;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children: ReactNode;
};

const BigButton = ({
	disabled,
	type,
	onClick,
	children
}: ButtonProps): JSX.Element => (
	<button
		className={classes.button}
		disabled={disabled}
		type={type}
		onClick={onClick}
	>
		{children}
	</button>
);

export default memo(BigButton);
