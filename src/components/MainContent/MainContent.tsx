import { ReactNode, memo } from 'react';

import classes from './MainContent.module.css';

type MainContentProps = {
	children: ReactNode;
};

const MainContent = ({ children }: MainContentProps) => (
	<main className={classes.main}>
		<div className={classes.content}>{children}</div>
	</main>
);

export default memo(MainContent);
