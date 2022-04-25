import { GITHUB_URL } from '../../routeConstants';
import Link from 'next/link';
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
				<Link href="/create">
					<a className={classes['nav-link']} onClick={onClickLink}>
						Create
					</a>
				</Link>
			</li>
			<li>
				<Link href="#">
					<a className={classes['nav-link']} onClick={onClickLink}>
						Log In
					</a>
				</Link>
			</li>
			<li>
				<Link href="/sign-up">
					<a className={classes['nav-link']} onClick={onClickLink}>
						Sign Up
					</a>
				</Link>
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
