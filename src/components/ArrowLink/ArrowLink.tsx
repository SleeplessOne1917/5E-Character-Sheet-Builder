'use client';

import { ArrowSmallRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import classes from './ArrowLink.module.css';

type ArrowLinkProps = {
	href: string;
	text: string;
};

const ArrowLink = ({ href, text }: ArrowLinkProps) => (
	<Link href={href} passHref legacyBehavior>
		<a className={classes['arrow-link']} data-testid="arrow-link">
			{text}
			<ArrowSmallRightIcon className={classes['link-arrow']} />
		</a>
	</Link>
);

export default ArrowLink;
