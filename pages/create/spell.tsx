import { GetStaticPropsResult, NextPage } from 'next';
import {
	getDamageTypes,
	getMagicSchools,
	getSpellcastingClasses
} from '../../src/graphql/srdClientService';
import useRedirectLoggedOffUser from '../../src/hooks/useRedirectLoggedOffUser';
import { SrdItem } from '../../src/types/srd';
import SpellView from '../../src/views/create/spell/Spell';

type SpellPageProps = {
	magicSchools: SrdItem[];
	classes: SrdItem[];
	damageTypes: SrdItem[];
};

const SpellPage: NextPage<SpellPageProps> = ({
	magicSchools,
	classes,
	damageTypes
}: SpellPageProps) => {
	const { loading } = useRedirectLoggedOffUser();

	return (
		<SpellView
			magicSchools={magicSchools}
			loading={loading}
			srdClasses={classes}
			damageTypes={damageTypes}
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

	return {
		props: {
			magicSchools: [...magicSchools].sort((a, b) =>
				a.name.localeCompare(b.name)
			),
			classes,
			damageTypes
		}
	};
};
