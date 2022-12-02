import {
	getAbilities,
	getDamageTypes,
	getMagicSchools,
	getSpellcastingClasses
} from '../../../src/graphql/srdClientService';

import SpellView from '../../../src/views/create/spell/Spell';
import { getSession } from '../../../src/services/sessionService';
import { redirect } from 'next/navigation';

const SpellPage = async () => {
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
		<SpellView
			magicSchools={magicSchools}
			srdClasses={classes}
			damageTypes={damageTypes}
			abilities={abilities}
		/>
	);
};

export default SpellPage;
