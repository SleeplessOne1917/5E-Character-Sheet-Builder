import { GITHUB_URL } from '../../routeConstants';
import LinkButton from '../LinkButton/LinkButton';
import { MouseEventHandler } from 'react';
import classes from './MobileNav.module.css';
import { useAppSelector } from '../../hooks/reduxHooks';
import useLogout from '../../hooks/useLogout';

type MobileNavProps = {
	isOpen: boolean;
	onClickLink: MouseEventHandler<HTMLAnchorElement>;
};

const MobileNav = ({ isOpen, onClickLink }: MobileNavProps): JSX.Element => {
	const viewer = useAppSelector(state => state.viewer);
	const logout = useLogout();

	return (
		<nav
			className={`${classes['mobile-nav']}${isOpen ? ` ${classes.open}` : ''}`}
		>
			<ul className={classes['nav-list']}>
				<li>
					<LinkButton href="/create" onClick={onClickLink}>
						Create
					</LinkButton>
				</li>
				{!viewer && (
					<>
						<li>
							<LinkButton href="/log-in" onClick={onClickLink}>
								Log In
							</LinkButton>
						</li>
						<li>
							<LinkButton href="/sign-up" onClick={onClickLink}>
								Sign Up
							</LinkButton>
						</li>
					</>
				)}
				{viewer && (
					<li>
						<LinkButton href="#" onClick={logout}>
							Log Out
						</LinkButton>
					</li>
				)}
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
};

export default MobileNav;
