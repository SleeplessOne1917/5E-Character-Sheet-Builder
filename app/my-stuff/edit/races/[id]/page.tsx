import {
	getAbilities,
	getLanguages,
	getProficienciesByType
} from '../../../../../src/graphql/srdClientService';

import EditRaceView from '../../../../../src/views/MyStuff/edit/races/EditRace';
import { ProficiencyType } from '../../../../../src/types/srd';
import { getSession } from '../../../../../src/services/sessionService';
import { redirect } from 'next/navigation';

const proficiencyTypes: ProficiencyType[] = [
	'ARMOR',
	'WEAPONS',
	'SKILLS',
	'ARTISANS_TOOLS',
	'MUSICAL_INSTRUMENTS'
];

const EditRacePage = async ({ params: { id } }: { params: { id: string } }) => {
	const session = await getSession();

	if (!session?.user) {
		redirect('/');
	}

	const abilities = (await getAbilities()) ?? [];
	const languages = (await getLanguages()) ?? [];

	const proficiencies =
		(await getProficienciesByType(proficiencyTypes))?.data?.proficiencies ?? [];

	return (
		<EditRaceView
			abilities={abilities}
			languages={languages}
			proficiencies={proficiencies}
			id={id}
		/>
	);
};

export default EditRacePage;
