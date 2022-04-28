import { GITHUB_URL } from '../../routeConstants';
import Link from 'next/link';
import LinkButton from '../LinkButton/LinkButton';
import { MouseEventHandler } from 'react';
import classes from './MobileNav.module.css';

type MobileNavProps = {
	isOpen: boolean;
	onClickLink: MouseEventHandler<HTMLAnchorElement>;
};

const MobileNav = ({ isOpen, onClickLink }: MobileNavProps): JSX.Element => (
	<nav
		className={`${classes['mobile-nav']}${isOpen ? ` ${classes.open}` : ''}`}
	>
		<ul className={classes['nav-list']}>
			<li>
				<LinkButton href="/create" onClick={onClickLink}>
					Create
				</LinkButton>
			</li>
			<li>
				<LinkButton href="#" onClick={onClickLink}>
					Log In
				</LinkButton>
			</li>
			<li>
				<LinkButton href="/sign-up" onClick={onClickLink}>
					Sign Up
				</LinkButton>
			</li>
		</ul>
		<hr className={classes.hr} />
		<ul className={classes['external-list']}>
			<li>
				<a
					href={GITHUB_URL}
					className={classes['external-link']}
					onClick={onClickLink}
				>
					<svg className={classes.icon}>
						<use xlinkHref="/Icons.svg#github" />
					</svg>
					Check out the source code!
				</a>
			</li>
		</ul>
	</nav>
);

export default MobileNav;
