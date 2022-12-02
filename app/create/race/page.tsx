import {
	getAbilities,
	getLanguages,
	getProficienciesByType
} from '../../../src/graphql/srdClientService';

import { ProficiencyType } from '../../../src/types/srd';
import RaceView from '../../../src/views/create/race/Race';
import { getSession } from '../../../src/services/sessionService';
import { getSpells } from '../../../src/services/spellsService';
import { redirect } from 'next/navigation';

const proficiencyTypes: ProficiencyType[] = [
	'ARMOR',
	'WEAPONS',
	'SKILLS',
	'ARTISANS_TOOLS',
	'MUSICAL_INSTRUMENTS'
];

const RacePage = async () => {
	const session = await getSession();

	if (!session?.user) {
		redirect('/');
	}

	const abilities = (await getAbilities()) ?? [];
	const languages = (await getLanguages()) ?? [];
	const spells = (await getSpells()) ?? [];

	const proficiencies =
		(await getProficienciesByType(proficiencyTypes))?.data?.proficiencies ?? [];

	return (
		<RaceView
			abilities={abilities}
			languages={languages}
			proficiencies={proficiencies}
			spells={spells}
		/>
	);
};

export default RacePage;
