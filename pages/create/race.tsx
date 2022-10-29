import { GetStaticPropsResult, NextPage } from 'next';
import { getAbilities, getLanguages } from '../../src/graphql/srdClientService';
import useRedirectLoggedOffUser from '../../src/hooks/useRedirectLoggedOffUser';
import { AbilityItem, SrdItem } from '../../src/types/srd';
import RaceView from '../../src/views/create/race/Race';

type RacePageProps = {
	abilities: AbilityItem[];
	languages: SrdItem[];
};

const RacePage: NextPage<RacePageProps> = ({ abilities, languages }) => {
	const { loading } = useRedirectLoggedOffUser();

	return (
		<RaceView loading={loading} abilities={abilities} languages={languages} />
	);
};

export default RacePage;

export const getStaticProps = async (): Promise<
	GetStaticPropsResult<RacePageProps>
> => {
	const abilities = (await getAbilities()) ?? [];
	const languages = (await getLanguages()) ?? [];

	return {
		props: {
			abilities,
			languages
		}
	};
};
