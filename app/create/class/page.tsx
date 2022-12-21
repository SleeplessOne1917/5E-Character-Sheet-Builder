import {
	getAbilities,
	getProficienciesByType
} from '../../../src/graphql/srdClientService';

import ClassView from '../../../src/views/create/class/Class';
import { ProficiencyType } from '../../../src/types/srd';
import { getSession } from '../../../src/services/sessionService';
import { redirect } from 'next/navigation';

const proficiencyTypes: ProficiencyType[] = [
	'ARMOR',
	'WEAPONS',
	'SKILLS',
	'ARTISANS_TOOLS',
	'MUSICAL_INSTRUMENTS'
];

const ClassPage = async () => {
	const session = await getSession();

	if (!session?.user) {
		redirect('/');
	}

	const proficiencies =
		(await getProficienciesByType(proficiencyTypes))?.data?.proficiencies ?? [];
	const abilities = (await getAbilities()) ?? [];

	return <ClassView proficiencies={proficiencies} abilities={abilities} />;
};

export default ClassPage;
