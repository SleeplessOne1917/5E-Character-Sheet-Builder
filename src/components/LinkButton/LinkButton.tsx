import { MouseEventHandler, ReactNode, memo } from 'react';

import Link from 'next/link';
import classes from './LinkButton.module.css';

export type LinkButtonProps = {
	href: string;
	onClick?: MouseEventHandler<HTMLAnchorElement>;
	children: ReactNode;
	tabIndex?: number;
};

const LinkButton = ({
	href,
	onClick,
	children,
	tabIndex
}: LinkButtonProps): JSX.Element => (
	<Link href={href}>
		<a
			className={classes['link-button']}
			onClick={onClick}
			tabIndex={tabIndex ? tabIndex : 0}
		>
			{children}
		</a>
	</Link>
);

LinkButton.defaultProps = {
	onClick: () => {}
};

export default memo(LinkButton);
