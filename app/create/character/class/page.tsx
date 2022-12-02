import {
	getAbilities,
	getClasses
} from '../../../../src/graphql/srdClientService';

import ClassView from '../../../../src/views/create/character/class/Class';

const ClassPage = async () => {
	const classes = (await getClasses()) ?? [];
	const abilities = (await getAbilities()) ?? [];

	return <ClassView classes={classes} abilities={abilities} />;
};

export default ClassPage;
