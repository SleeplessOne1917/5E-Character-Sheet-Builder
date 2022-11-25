import {
	getAbilities,
	getDamageTypes,
	getMagicSchools,
	getSpellcastingClasses
} from '../../../src/graphql/srdClientService';

import SpellView from '../../../src/views/create/spell/Spell';
import { getViewer } from '../../../src/graphql/characterSheetBuilderClientService';

const SpellPage = async () => {
	const magicSchools = [...((await getMagicSchools()) ?? [])].sort((a, b) =>
		a.name.localeCompare(b.name)
	);
	const classes = (await getSpellcastingClasses()) ?? [];
	const damageTypes = (await getDamageTypes()) ?? [];
	const abilities = (await getAbilities()) ?? [];

	const username = await getViewer();

	return (
		<SpellView
			magicSchools={magicSchools}
			username={username}
			srdClasses={classes}
			damageTypes={damageTypes}
			abilities={abilities}
		/>
	);
};

export default SpellPage;
