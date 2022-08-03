import { GetStaticPropsResult, NextPage } from 'next';
import { SrdItem, SrdSubraceItem } from '../../src/types/srd';
import { getRaces, getSubraces } from '../../src/graphql/srdClientService';

import RaceView from '../../src/views/create/race/Race';

type RacePageProps = {
	races: SrdItem[];
	subraces: SrdSubraceItem[];
};

const RacePage: NextPage<RacePageProps> = ({
	races,
	subraces
}: RacePageProps) => <RaceView races={races} subraces={subraces} />;

export default RacePage;

export const getStaticProps = async (): Promise<
	GetStaticPropsResult<RacePageProps>
> => {
	const racesResult = await getRaces();
	const subracesResult = await getSubraces();

	return {
		props: {
			races: racesResult?.data?.races ?? [],
			subraces: subracesResult?.data?.subraces ?? []
		}
	};
};
