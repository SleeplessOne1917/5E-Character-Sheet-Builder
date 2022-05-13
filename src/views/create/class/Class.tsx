import MainContent from '../../../components/MainContent/MainContent';
import { SrdItem } from '../../../types/srd';

type ClassProps = {
	classes: SrdItem[];
};

const Class = ({ classes }: ClassProps): JSX.Element => (
	<MainContent>
		<ul>
			{classes.map(klass => (
				<li key={klass.index}>{klass.name}</li>
			))}
		</ul>
	</MainContent>
);

export default Class;
