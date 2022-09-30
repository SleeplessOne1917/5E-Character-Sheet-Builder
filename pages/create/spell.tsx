import { AbilityItem, SrdItem } from '../../src/types/srd';
import { GetStaticPropsResult, NextPage } from 'next';
import {
	getAbilities,
	getDamageTypes,
	getMagicSchools,
	getSpellcastingClasses
} from '../../src/graphql/srdClientService';

import SpellView from '../../src/views/create/spell/Spell';
import useRedirectLoggedOffUser from '../../src/hooks/useRedirectLoggedOffUser';

type SpellPageProps = {
	magicSchools: SrdItem[];
	classes: SrdItem[];
	damageTypes: SrdItem[];
	abilities: AbilityItem[];
};

const SpellPage: NextPage<SpellPageProps> = ({
	magicSchools,
	classes,
	damageTypes,
	abilities
}: SpellPageProps) => {
	const { loading } = useRedirectLoggedOffUser();

	return (
		<SpellView
			magicSchools={magicSchools}
			loading={loading}
			srdClasses={classes}
			damageTypes={damageTypes}
			abilities={abilities}
		/>
	);
};

export default SpellPage;

export const getStaticProps = async (): Promise<
	GetStaticPropsResult<SpellPageProps>
> => {
	const magicSchools = (await getMagicSchools()) ?? [];
	const classes = (await getSpellcastingClasses()) ?? [];
	const damageTypes = (await getDamageTypes()) ?? [];
	const abilities = (await getAbilities()) ?? [];

	return {
		props: {
			magicSchools: [...magicSchools].sort((a, b) =>
				a.name.localeCompare(b.name)
			),
			classes,
			damageTypes,
			abilities
		}
	};
};
