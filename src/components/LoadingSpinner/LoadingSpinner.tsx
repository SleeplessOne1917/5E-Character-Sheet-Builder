import classes from './LoadingSpinner.module.css';

const LoadingSpinner = () => (
	<div className={classes.container}>
		<svg className={classes.icon}>
			<use xlinkHref={'/Icons.svg#spinner'} />
		</svg>
	</div>
);

export default LoadingSpinner;
