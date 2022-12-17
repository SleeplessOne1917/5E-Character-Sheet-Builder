import ClassView from '../../../src/views/create/class/Class';
import { ProficiencyType } from '../../../src/types/srd';
import { getProficienciesByType } from '../../../src/graphql/srdClientService';
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

	return <ClassView proficiencies={proficiencies} />;
};

export default ClassPage;
