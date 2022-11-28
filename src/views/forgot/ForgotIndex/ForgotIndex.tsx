'use client';

import LinkButton from '../../../components/LinkButton/LinkButton';
import MainContent from '../../../components/MainContent/MainContent';
import classes from './ForgotIndex.module.css';

const ForgotIndex = () => {
	return (
		<MainContent testId="forgot-index">
			<div className={classes.content}>
				<h1 className={classes['header-text']}>Forgot Something?</h1>
				<div className={classes['button-container']}>
					<LinkButton href="/forgot/username">Forgot username</LinkButton>
					<LinkButton href="/forgot/password">Forgot password</LinkButton>
				</div>
			</div>
		</MainContent>
	);
};

export default ForgotIndex;
