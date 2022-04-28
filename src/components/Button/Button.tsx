import { MouseEventHandler, ReactNode, memo } from 'react';

import classes from './Button.module.css';

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

const Button = ({ disabled, type, onClick, children }: ButtonProps) => (
	<button
		className={classes.button}
		disabled={disabled}
		type={type}
		onClick={onClick}
	>
		{children}
	</button>
);

export default memo(Button);
