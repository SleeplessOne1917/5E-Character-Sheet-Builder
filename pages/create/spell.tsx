import { GetStaticPropsResult, NextPage } from 'next';
import { getMagicSchools } from '../../src/graphql/srdClientService';
import useRedirectLoggedOffUser from '../../src/hooks/useRedirectLoggedOffUser';
import { SrdItem } from '../../src/types/srd';
import SpellView from '../../src/views/create/spell/Spell';

type SpellPageProps = {
	magicSchools: SrdItem[];
};

const SpellPage: NextPage<SpellPageProps> = ({
	magicSchools
}: SpellPageProps) => {
	const { loading } = useRedirectLoggedOffUser();

	return <SpellView magicSchools={magicSchools} loading={loading} />;
};

export default SpellPage;

export const getStaticProps = async (): Promise<
	GetStaticPropsResult<SpellPageProps>
> => {
	const magicSchools = (await getMagicSchools()) ?? [];

	return {
		props: {
			magicSchools: [...magicSchools].sort((a, b) =>
				a.name.localeCompare(b.name)
			)
		}
	};
};
