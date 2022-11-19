import {
	AbilityItem,
	ProficiencyType,
	SrdItem,
	SrdProficiencyItem
} from '../../src/types/srd';
import { GetStaticPropsResult, NextPage } from 'next';
import {
	getAbilities,
	getLanguages,
	getProficienciesByType
} from '../../src/graphql/srdClientService';

import RaceView from '../../src/views/create/race/Race';
import { Spell } from '../../src/types/characterSheetBuilderAPI';
import { getSpells } from '../../src/services/spellsService';
import useRedirectLoggedOffUser from '../../src/hooks/useRedirectLoggedOffUser';

type RacePageProps = {
	abilities: AbilityItem[];
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
	srdSpells: Spell[];
};

const RacePage: NextPage<RacePageProps> = ({
	abilities,
	languages,
	proficiencies,
	srdSpells
}) => {
	const { loading } = useRedirectLoggedOffUser();

	return (
		<RaceView
			loading={loading}
			abilities={abilities}
			languages={languages}
			proficiencies={proficiencies}
			srdSpells={srdSpells}
		/>
	);
};

export default RacePage;

export const getStaticProps = async (): Promise<
	GetStaticPropsResult<RacePageProps>
> => {
	const abilities = (await getAbilities()) ?? [];
	const languages = (await getLanguages()) ?? [];
	const srdSpells = (await getSpells()) ?? [];

	const proficiencyTypes: ProficiencyType[] = [
		'ARMOR',
		'WEAPONS',
		'SKILLS',
		'ARTISANS_TOOLS',
		'MUSICAL_INSTRUMENTS'
	];

	const proficiencies =
		(await getProficienciesByType(proficiencyTypes))?.data?.proficiencies ?? [];

	return {
		props: {
			abilities,
			languages,
			proficiencies,
			srdSpells
		}
	};
};
