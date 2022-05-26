import { ReactNode, memo } from 'react';

import classes from './MainContent.module.css';

type MainContentProps = {
	children: ReactNode;
	testId?: string;
};

const MainContent = ({ children, testId }: MainContentProps) => (
	<main className={classes.main} data-testid={testId}>
		<div className={classes.content}>{children}</div>
	</main>
);

export default memo(MainContent);
