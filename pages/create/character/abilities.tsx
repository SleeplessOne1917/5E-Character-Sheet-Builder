import { GetStaticPropsResult, NextPage } from 'next';

import AbilitiesView from '../../../src/views/create/character/abilities/Abilities';
import { AbilityItem } from '../../../src/types/srd';
import { getAbilities } from '../../../src/graphql/srdClientService';

type AbilitiesPageProps = {
	abilities: AbilityItem[];
};

const AbilitiesPage: NextPage<AbilitiesPageProps> = ({
	abilities
}: AbilitiesPageProps) => <AbilitiesView abilities={abilities} />;

export default AbilitiesPage;

export const getStaticProps = async (): Promise<
	GetStaticPropsResult<AbilitiesPageProps>
> => {
	const abilities = (await getAbilities()) as AbilityItem[];

	return {
		props: {
			abilities: [...abilities].sort((a, b) =>
				a.full_name.localeCompare(b.full_name)
			)
		}
	};
};
