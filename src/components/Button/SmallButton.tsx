import { CSSProperties, MouseEventHandler, ReactNode } from 'react';

import classes from './SmallButton.module.css';

type SmallButtonProps = {
	disabled?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children: ReactNode;
	positive?: boolean;
	style?: CSSProperties;
};

const SmallButton = ({
	disabled,
	onClick,
	children,
	positive,
	style
}: SmallButtonProps): JSX.Element => (
	<button
		disabled={disabled}
		onClick={onClick}
		className={`${classes.button} ${
			positive ? classes.positive : classes.negative
		}`}
		style={style}
	>
		{children}
	</button>
);

export default SmallButton;
