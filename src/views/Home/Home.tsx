import Link from 'next/link';
import LinkButton from '../../components/LinkButton/LinkButton';
import classes from './Home.module.css';

const Home = (): JSX.Element => {
	return (
		<main className={classes.main}>
			<div className={classes.content}>
				<p className={classes.blurb}>
					Create awesome{' '}
					<span className={classes.dnd}>
						D&D 5<span className={classes.supertext}>th</span> Edition
					</span>{' '}
					character sheets with this free and open-source online tool.
				</p>
				<LinkButton href="/create">Get Started</LinkButton>
			</div>
		</main>
	);
};

export default Home;
