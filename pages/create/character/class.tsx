import { GetStaticPropsResult, NextPage } from 'next';

import ClassView from '../../../src/views/create/character/class/Class';
import { SrdItem } from '../../../src/types/srd';
import { getClasses } from '../../../src/graphql/srdClientService';

type ClassPageProps = {
	classes: SrdItem[];
};

const ClassPage: NextPage<ClassPageProps> = ({ classes }: ClassPageProps) => (
	<ClassView classes={classes} />
);

export default ClassPage;

export const getStaticProps = async (): Promise<
	GetStaticPropsResult<ClassPageProps>
> => {
	const classes = await getClasses();

	return { props: { classes } };
};
