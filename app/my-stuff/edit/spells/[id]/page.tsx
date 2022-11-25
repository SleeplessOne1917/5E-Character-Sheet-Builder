import {
	getAbilities,
	getDamageTypes,
	getMagicSchools,
	getSpellcastingClasses
} from '../../../../../src/graphql/srdClientService';

import EditSpellView from '../../../../../src/views/MyStuff/edit/spells/EditSpell';
import { getSpell } from '../../../../../src/services/spellsService';
import { getViewer } from '../../../../../src/graphql/characterSheetBuilderClientService';

const EditSpellPage = async ({
	params: { id }
}: {
	params: { id: string };
}) => {
	const username = await getViewer();

	const magicSchools = [...((await getMagicSchools()) ?? [])].sort((a, b) =>
		a.name.localeCompare(b.name)
	);
	const classes = (await getSpellcastingClasses()) ?? [];
	const damageTypes = (await getDamageTypes()) ?? [];
	const abilities = (await getAbilities()) ?? [];

	const spell = id ? await getSpell(id as string) : undefined;

	return (
		<EditSpellView
			username={username}
			magicSchools={magicSchools}
			srdClasses={classes}
			damageTypes={damageTypes}
			abilities={abilities}
			spell={spell}
		/>
	);
};

export default EditSpellPage;
