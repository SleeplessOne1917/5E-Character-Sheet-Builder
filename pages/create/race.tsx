import { GetStaticPropsResult, NextPage } from 'next';

import RaceView from '../../src/views/create/race/Race';
import { SrdItem } from '../../src/types/srd';
import { getRaces } from '../../src/graphql/srdClientService';

type RacePageProps = {
	races: SrdItem[];
};

const RacePage: NextPage<RacePageProps> = ({ races }: RacePageProps) => (
	<RaceView races={races} />
);

export default RacePage;

export const getStaticProps = async (): Promise<
	GetStaticPropsResult<RacePageProps>
> => {
	const races: SrdItem[] = await getRaces();

	return {
		props: {
			races
		}
	};
};
