import MainContent from '../../../../components/MainContent/MainContent';
import { SrdItem } from '../../../../types/srd';
import styles from './Class.module.css';

type ClassProps = {
	classes: SrdItem[];
};

const Class = ({ classes }: ClassProps): JSX.Element => (
	<MainContent>
		<h1 className={styles.title}>Choose Class</h1>
		<ul className={styles['class-list']}>
			{classes.map(klass => (
				<li key={klass.index}>{klass.name}</li>
			))}
		</ul>
	</MainContent>
);

export default Class;
