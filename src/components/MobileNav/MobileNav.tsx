import { GITHUB_URL } from '../../constants/routeConstants';
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
					<LinkButton href="/create" onClick={onClickLink} tabIndex={-1}>
						Create
					</LinkButton>
				</li>
				{!viewer && (
					<>
						<li>
							<LinkButton href="/log-in" onClick={onClickLink} tabIndex={-1}>
								Log In
							</LinkButton>
						</li>
						<li>
							<LinkButton href="/sign-up" onClick={onClickLink} tabIndex={-1}>
								Sign Up
							</LinkButton>
						</li>
					</>
				)}
				{viewer && (
					<>
						<li>
							<LinkButton href="/my-stuff" onClick={onClickLink} tabIndex={-1}>
								My Stuff
							</LinkButton>
						</li>
						<li>
							<LinkButton href="/account" onClick={onClickLink} tabIndex={-1}>
								Account
							</LinkButton>
						</li>
						<li>
							<LinkButton
								href="#"
								onClick={event => {
									logout();
									onClickLink(event);
								}}
								tabIndex={-1}
							>
								Log Out
							</LinkButton>
						</li>
					</>
				)}
			</ul>
			<hr className={classes.hr} />
			<ul className={classes['external-list']}>
				<li>
					<a
						href={GITHUB_URL}
						className={classes['external-link']}
						onClick={onClickLink}
						tabIndex={-1}
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
