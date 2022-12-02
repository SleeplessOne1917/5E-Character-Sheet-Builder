import {
	getAbilities,
	getDamageTypes,
	getMagicSchools,
	getSpellcastingClasses
} from '../../../../../src/graphql/srdClientService';

import EditSpellView from '../../../../../src/views/MyStuff/edit/spells/EditSpell';
import { getSession } from '../../../../../src/services/sessionService';
import { redirect } from 'next/navigation';

const EditSpellPage = async ({
	params: { id }
}: {
	params: { id: string };
}) => {
	const session = await getSession();

	if (!session?.user) {
		redirect('/');
	}

	const magicSchools = [...((await getMagicSchools()) ?? [])].sort((a, b) =>
		a.name.localeCompare(b.name)
	);
	const classes = (await getSpellcastingClasses()) ?? [];
	const damageTypes = (await getDamageTypes()) ?? [];
	const abilities = (await getAbilities()) ?? [];

	return (
		<EditSpellView
			magicSchools={magicSchools}
			srdClasses={classes}
			damageTypes={damageTypes}
			abilities={abilities}
			id={id}
		/>
	);
};

export default EditSpellPage;
