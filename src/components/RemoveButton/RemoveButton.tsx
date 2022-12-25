import Button from '../Button/Button';
import { CSSProperties } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import styles from './RemoveButtonIcon.module.css';

type RemoveButtonProps = {
	onClick: () => void;
	style?: CSSProperties;
};

const RemoveButton = ({ onClick, style = {} }: RemoveButtonProps) => (
	<Button
		size="small"
		style={{
			position: 'absolute',
			top: 0,
			right: 0,
			display: 'flex',
			alignItems: 'center',
			marginRight: '-0.1rem',
			marginTop: '-0.1rem',
			borderTopRightRadius: '1rem',
			...style
		}}
		onClick={onClick}
	>
		<XMarkIcon className={styles['close-button-icon']} /> Remove
	</Button>
);

export default RemoveButton;
