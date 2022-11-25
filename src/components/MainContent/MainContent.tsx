'use client';

import { PropsWithChildren, forwardRef } from 'react';

import classes from './MainContent.module.css';

type MainContentProps = {
	testId?: string;
};

const MainContent = forwardRef<
	HTMLDivElement,
	PropsWithChildren<MainContentProps>
>(({ children, testId }, ref) => (
	<main className={classes.main} data-testid={testId}>
		<div className={classes.content} ref={ref}>
			{children}
		</div>
	</main>
));

MainContent.displayName = 'MainContent';

export default MainContent;
