import ArrowLink from '../../ArrowLink/ArrowLink';
import classes from './Preview.module.css';

type PreviewProps = {
	items: JSX.Element[];
	title: string;
	path: string;
};

const Preview = ({ items, title, path }: PreviewProps) => (
	<section className={classes.preview} data-testid="preview">
		<h2>{title}</h2>
		<div className={classes.items}>{items}</div>
		<ArrowLink href={`/my-stuff/${path}`} text={`See All ${title}`} />
	</section>
);

export default Preview;
