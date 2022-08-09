import { CSSProperties, MouseEventHandler, ReactNode, forwardRef } from 'react';

import classes from './Button.module.css';

export enum ButtonType {
	button = 'button',
	submit = 'submit'
}

type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = {
	disabled?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children: ReactNode;
	positive?: boolean;
	type?: ButtonType;
	size?: ButtonSize;
	spacing?: number;
	style?: CSSProperties;
};

const getFontSize = (size: ButtonSize) => {
	switch (size) {
		case 'small':
			return 0.7;
		case 'medium':
			return 1.3;
		case 'large':
			return 2.5;
	}
};

const getPadding = (size: ButtonSize) => {
	switch (size) {
		case 'small':
			return 0.3;
		case 'medium':
		case 'large':
			return 1;
	}
};

const Button = forwardRef(
	(
		{
			disabled,
			onClick,
			children,
			positive,
			type = ButtonType.button,
			size = 'medium',
			spacing,
			style = {}
		}: ButtonProps,
		ref
	): JSX.Element => (
		<button
			disabled={disabled}
			onClick={onClick}
			className={`${classes.button} ${
				positive ? classes.positive : classes.negative
			}`}
			style={{
				fontSize: `${getFontSize(size)}rem`,
				padding: `${getPadding(size)}rem`,
				margin: `${0.25 * (spacing || 1)}rem`,
				...style
			}}
			type={type}
			ref={ref}
		>
			{children}
		</button>
	)
);

Button.displayName = 'Button';

export default Button;
