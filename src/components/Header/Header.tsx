'use client';

import { Bars3Icon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { MouseEventHandler } from 'react';
import classes from './Header.module.css';
import useLogout from '../../hooks/useLogout';

type HeaderProps = {
	onMenuIconClick: MouseEventHandler<SVGSVGElement>;
	onLogoIconClick: MouseEventHandler<HTMLAnchorElement>;
	username?: string;
};

const Header = ({
	onMenuIconClick,
	onLogoIconClick,
	username
}: HeaderProps): JSX.Element => {
	const logout = useLogout();

	return (
		<header className={classes.header} aria-label="Header" role="banner">
			<div className={classes['brand-container']}>
				<Link href="/" passHref legacyBehavior>
					<a onClick={onLogoIconClick} aria-label="Home" data-testid="home">
						<svg className={classes.logo}>
							<use xlinkHref="/Icons.svg#logo" />
						</svg>
					</a>
				</Link>
				<div className={classes['brand-text']}>
					D&D 5E Character Sheet Builder
				</div>
			</div>
			<nav className={classes.navigation}>
				<ul className={classes['navigation-list']}>
					<li className={classes['navigation-list-item']}>
						<Link href="/create" className={classes['navigation-link']}>
							Create
						</Link>
					</li>
					{!username && (
						<>
							<li className={classes['navigation-list-item']}>
								<Link href="/log-in" className={classes['navigation-link']}>
									Log In
								</Link>
							</li>
							<li className={classes['navigation-list-item']}>
								<Link href="/sign-up" className={classes['navigation-link']}>
									Sign Up
								</Link>
							</li>
						</>
					)}
					{username && (
						<>
							<li className={classes['navigation-list-item']}>
								<Link href="/my-stuff" className={classes['navigation-link']}>
									My Stuff
								</Link>
							</li>
							<li className={classes['navigation-list-item']}>
								<Link href="/account" className={classes['navigation-link']}>
									Account
								</Link>
							</li>
							<li className={classes['navigation-list-item']}>
								<Link
									href="#"
									className={classes['navigation-link']}
									onClick={logout}
								>
									Log Out
								</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
			<Bars3Icon
				className={classes['menu-icon']}
				onClick={onMenuIconClick}
				data-testid="menu"
			/>
		</header>
	);
};

export default Header;
