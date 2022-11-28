import {
	getAbilities,
	getRaces,
	getSubraces
} from '../../../../src/server/5E-API/srdClientService';

import RaceView from '../../../../src/views/create/character/race/Race';

const RacePage = async () => {
	const races = (await getRaces()).data?.races ?? [];
	const subraces = (await getSubraces()).data?.subraces ?? [];
	const abilities = (await getAbilities()) ?? [];

	return <RaceView races={races} subraces={subraces} abilities={abilities} />;
};

export default RacePage;
