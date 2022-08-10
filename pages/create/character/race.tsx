import { GetStaticPropsResult, NextPage } from 'next';
import { AbilityItem, SrdItem, SrdSubraceItem } from '../../../src/types/srd';
import {
	getAbilities,
	getRaces,
	getSubraces
} from '../../../src/graphql/srdClientService';

import RaceView from '../../../src/views/create/character/race/Race';

type RacePageProps = {
	races: SrdItem[];
	subraces: SrdSubraceItem[];
	abilities: AbilityItem[];
};

const RacePage: NextPage<RacePageProps> = ({
	races,
	subraces,
	abilities
}: RacePageProps) => (
	<RaceView races={races} subraces={subraces} abilities={abilities} />
);

export default RacePage;

export const getStaticProps = async (): Promise<
	GetStaticPropsResult<RacePageProps>
> => {
	const racesResult = await getRaces();
	const subracesResult = await getSubraces();
	const abilities = (await getAbilities()) as AbilityItem[];

	return {
		props: {
			races: racesResult?.data?.races ?? [],
			subraces: subracesResult?.data?.subraces ?? [],
			abilities
		}
	};
};
