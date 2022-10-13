import { AbilityItem, SrdItem } from '../../../../src/types/srd';
import { GetStaticPropsResult, NextPage } from 'next';
import {
	getAbilities,
	getDamageTypes,
	getMagicSchools,
	getSpellcastingClasses
} from '../../../../src/graphql/srdClientService';

import EditSpellView from '../../../../src/views/MyStuff/edit/spells/EditSpell';
import useRedirectLoggedOffUser from '../../../../src/hooks/useRedirectLoggedOffUser';
import { useRouter } from 'next/router';

type EditSpellPageProps = {
	magicSchools: SrdItem[];
	classes: SrdItem[];
	damageTypes: SrdItem[];
	abilities: AbilityItem[];
};

const EditSpellPage: NextPage<EditSpellPageProps> = ({
	magicSchools,
	classes,
	damageTypes,
	abilities
}) => {
	const { loading } = useRedirectLoggedOffUser();
	const router = useRouter();
	const { id } = router.query;

	return (
		<EditSpellView
			loading={loading}
			id={(id ?? '') as string}
			magicSchools={magicSchools}
			srdClasses={classes}
			damageTypes={damageTypes}
			abilities={abilities}
		/>
	);
};

export default EditSpellPage;

export const getServerSideProps = async (): Promise<
	GetStaticPropsResult<EditSpellPageProps>
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
