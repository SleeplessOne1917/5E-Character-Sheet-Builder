import AbilitiesView from '../../../../src/views/create/character/abilities/Abilities';
import { getAbilities } from '../../../../src/server/5E-API/srdClientService';

const AbilitiesPage = async () => {
	const abilities = (await getAbilities()) ?? [];

	return <AbilitiesView abilities={abilities} />;
};

export default AbilitiesPage;
