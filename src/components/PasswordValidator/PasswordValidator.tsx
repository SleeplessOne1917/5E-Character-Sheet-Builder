import { CheckIcon, XIcon } from '@heroicons/react/solid';
import {
	hasLowerCase,
	hasNumber,
	hasSpecialCharacter,
	hasUpperCase
} from '../../services/passwordValidatorService';

import classes from './PasswordValidator.module.css';
import { memo } from 'react';

export type PasswordValidatorProps = {
	password?: string;
};

const PasswordValidator = ({
	password
}: PasswordValidatorProps): JSX.Element => {
	return (
		<div className={classes.container}>
			<div
				className={`${classes.validator} ${
					classes[`${password && password.length >= 8 ? '' : 'no-'}match`]
				}`}
			>
				{password && password.length >= 8 ? (
					<CheckIcon className={`${classes.icon} ${classes.check}`} />
				) : (
					<XIcon className={`${classes.icon} ${classes.x}`} />
				)}{' '}
				At least 8 characters long
			</div>
			<div
				className={`${classes.validator} ${
					classes[`${password && hasLowerCase(password) ? '' : 'no-'}match`]
				}`}
			>
				{password && hasLowerCase(password) ? (
					<CheckIcon className={`${classes.icon} ${classes.check}`} />
				) : (
					<XIcon className={`${classes.icon} ${classes.x}`} />
				)}{' '}
				At least 1 lowercase letter
			</div>
			<div
				className={`${classes.validator} ${
					classes[`${password && hasUpperCase(password) ? '' : 'no-'}match`]
				}`}
			>
				{password && hasUpperCase(password) ? (
					<CheckIcon className={`${classes.icon} ${classes.check}`} />
				) : (
					<XIcon className={`${classes.icon} ${classes.x}`} />
				)}{' '}
				At least 1 uppercase letter
			</div>
			<div
				className={`${classes.validator} ${
					classes[`${password && hasNumber(password) ? '' : 'no-'}match`]
				}`}
			>
				{password && hasNumber(password) ? (
					<CheckIcon className={`${classes.icon} ${classes.check}`} />
				) : (
					<XIcon className={`${classes.icon} ${classes.x}`} />
				)}{' '}
				At least 1 number
			</div>
			<div
				className={`${classes.validator} ${
					classes[
						`${password && hasSpecialCharacter(password) ? '' : 'no-'}match`
					]
				}`}
			>
				{password && hasSpecialCharacter(password) ? (
					<CheckIcon className={`${classes.icon} ${classes.check}`} />
				) : (
					<XIcon className={`${classes.icon} ${classes.x}`} />
				)}{' '}
				At least 1 special character
			</div>
		</div>
	);
};

export default memo(PasswordValidator);
