import { MouseEventHandler, ReactNode, memo } from 'react';

import Link from 'next/link';
import classes from './LinkButton.module.css';

type LinkButtonProps = {
	href: string;
	onClick?: MouseEventHandler<HTMLAnchorElement>;
	children: ReactNode;
};

const LinkButton = ({
	href,
	onClick,
	children
}: LinkButtonProps): JSX.Element => (
	<Link href={href}>
		<a className={classes['link-button']} onClick={onClick}>
			{children}
		</a>
	</Link>
);

LinkButton.defaultProps = {
	onClick: () => {}
};

export default memo(LinkButton);
