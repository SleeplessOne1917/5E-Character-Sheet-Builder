import { GetStaticPropsResult, NextPage } from 'next';
import {
	getAbilities,
	getLanguages,
	getProficienciesByType
} from '../../src/graphql/srdClientService';
import useRedirectLoggedOffUser from '../../src/hooks/useRedirectLoggedOffUser';
import {
	AbilityItem,
	ProficiencyType,
	SrdItem,
	SrdProficiencyItem
} from '../../src/types/srd';
import RaceView from '../../src/views/create/race/Race';

type RacePageProps = {
	abilities: AbilityItem[];
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
};

const RacePage: NextPage<RacePageProps> = ({
	abilities,
	languages,
	proficiencies
}) => {
	const { loading } = useRedirectLoggedOffUser();

	return (
		<RaceView
			loading={loading}
			abilities={abilities}
			languages={languages}
			proficiencies={proficiencies}
		/>
	);
};

export default RacePage;

export const getStaticProps = async (): Promise<
	GetStaticPropsResult<RacePageProps>
> => {
	const abilities = (await getAbilities()) ?? [];
	const languages = (await getLanguages()) ?? [];

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
			proficiencies
		}
	};
};
