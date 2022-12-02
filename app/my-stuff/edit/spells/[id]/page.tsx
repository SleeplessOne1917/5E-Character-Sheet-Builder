import {
	getAbilities,
	getDamageTypes,
	getMagicSchools,
	getSpellcastingClasses
} from '../../../../../src/server/5E-API/srdClientService';

import EditSpellView from '../../../../../src/views/MyStuff/edit/spells/EditSpell';
import { getSession } from '../../../../../src/services/sessionService';
import { getSpell } from '../../../../../src/services/spellsService';
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

	const spell = id ? await getSpell(id as string) : undefined;

	if (!spell) {
		redirect('/');
	}

	return (
		<EditSpellView
			magicSchools={magicSchools}
			srdClasses={classes}
			damageTypes={damageTypes}
			abilities={abilities}
			spell={spell}
		/>
	);
};

export default EditSpellPage;
