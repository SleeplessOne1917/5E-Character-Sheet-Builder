import { AbilityItem, SrdItem } from '../../../src/types/srd';
import { GetStaticPropsResult, NextPage } from 'next';
import {
	getAbilities,
	getClasses
} from '../../../src/graphql/srdClientService';

import ClassView from '../../../src/views/create/character/class/Class';

type ClassPageProps = {
	classes: SrdItem[];
	abilities: AbilityItem[];
};

const ClassPage: NextPage<ClassPageProps> = ({
	classes,
	abilities
}: ClassPageProps) => <ClassView classes={classes} abilities={abilities} />;

export default ClassPage;

export const getStaticProps = async (): Promise<
	GetStaticPropsResult<ClassPageProps>
> => {
	const classes = (await getClasses()) ?? [];
	const abilities = (await getAbilities()) ?? [];

	return { props: { classes, abilities } };
};
