import {
	getAbilities,
	getLanguages,
	getProficienciesByType
} from '../../../src/graphql/srdClientService';

import { ProficiencyType } from '../../../src/types/srd';
import RaceView from '../../../src/views/create/race/Race';
import { getSpells } from '../../../src/services/spellsService';
import { getViewer } from '../../../src/graphql/characterSheetBuilderClientService';

const proficiencyTypes: ProficiencyType[] = [
	'ARMOR',
	'WEAPONS',
	'SKILLS',
	'ARTISANS_TOOLS',
	'MUSICAL_INSTRUMENTS'
];

const RacePage = async () => {
	const abilities = (await getAbilities()) ?? [];
	const languages = (await getLanguages()) ?? [];
	const spells = (await getSpells()) ?? [];

	const proficiencies =
		(await getProficienciesByType(proficiencyTypes))?.data?.proficiencies ?? [];

	const username = await getViewer();

	return (
		<RaceView
			username={username}
			abilities={abilities}
			languages={languages}
			proficiencies={proficiencies}
			spells={spells}
		/>
	);
};

export default RacePage;
