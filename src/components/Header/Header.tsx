import Link from 'next/link';
import { MenuIcon } from '@heroicons/react/solid';
import { MouseEventHandler } from 'react';
import classes from './Header.module.css';
import { useAppSelector } from '../../hooks/reduxHooks';

type HeaderProps = {
	onMenuIconClick: MouseEventHandler<SVGSVGElement>;
	onLogoIconClick: MouseEventHandler<HTMLAnchorElement>;
};

const Header = ({
	onMenuIconClick,
	onLogoIconClick
}: HeaderProps): JSX.Element => {
	const viewer = useAppSelector(state => state.viewer);

	return (
		<header className={classes.header}>
			<div className={classes['brand-container']}>
				<Link href="/">
					<a onClick={onLogoIconClick}>
						<svg className={classes.logo}>
							<use xlinkHref="/Icons.svg#logo" />
						</svg>
					</a>
				</Link>
				<h1 className={classes['brand-text']}>
					D&D 5E Character Sheet Builder
				</h1>
			</div>
			<nav className={classes.navigation}>
				<ul className={classes['navigation-list']}>
					<li className={classes['navigation-list-item']}>
						<Link href="/create">
							<a className={classes['navigation-link']}>Create</a>
						</Link>
					</li>
					{!viewer && (
						<>
							<li className={classes['navigation-list-item']}>
								<Link href="/log-in">
									<a className={classes['navigation-link']}>Log In</a>
								</Link>
							</li>
							<li className={classes['navigation-list-item']}>
								<Link href="/sign-up">
									<a className={classes['navigation-link']}>Sign Up</a>
								</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
			<MenuIcon className={classes['menu-icon']} onClick={onMenuIconClick} />
		</header>
	);
};

export default Header;
