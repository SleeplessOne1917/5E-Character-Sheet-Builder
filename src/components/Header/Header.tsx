import DiceSVG from '../svgs/DiceSVG';
import Link from 'next/link';
import { MenuIcon } from '@heroicons/react/solid';
import classes from './Header.module.css';

const Header = (): JSX.Element => (
	<header className={classes.header}>
		<div className={classes['brand-container']}>
			<Link href="/">
				<a>
					<DiceSVG
						backgroundClass={classes['logo-background']}
						foregroundClass={classes['logo-foreground']}
						className={classes.logo}
					/>
				</a>
			</Link>
			<h1 className={classes['brand-text']}>D&D 5E Character Sheet Builder</h1>
		</div>
		<nav className={classes.navigation}>
			<ul className={classes['navigation-list']}>
				<li className={classes['navigation-list-item']}>
					<Link href="/create">
						<a className={classes['navigation-link']}>Create</a>
					</Link>
				</li>
				<li className={classes['navigation-list-item']}>
					<Link href="#">
						<a className={classes['navigation-link']}>Log In</a>
					</Link>
				</li>
			</ul>
		</nav>
		<MenuIcon className={classes['menu-icon']} />
	</header>
);

export default Header;
