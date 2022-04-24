import { GITHUB_URL } from '../../routeConstants';
import classes from './Footer.module.css';

const Footer = (): JSX.Element => (
	<footer className={classes.footer}>
		<ul className={classes['link-list']}>
			<li>
				<a href={GITHUB_URL} className={classes.link}>
					<svg className={classes['github-icon']}>
						<use xlinkHref="/Icons.svg#github" />
					</svg>
					Check out the source code!
				</a>
			</li>
		</ul>
	</footer>
);

export default Footer;
