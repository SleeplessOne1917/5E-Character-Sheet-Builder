import { Descriptor } from '../types/creation';
import { Race } from '../types/characterSheetBuilderAPI';
import { capitalize } from './capitalizeService';
import { formatItemList } from './itemListformatter';
import { getAbilityScoreDescriptionFromRace } from './abilityBonusService';

export const getRaceDescriptors = (race?: Race) => {
	const descriptors = race?.traits?.map<Descriptor>(trait => ({
		title: trait.name,
		description: trait.description
	}));

	const otherDescriptors = race
		? ([
				{
					title: 'Languages',
					description: formatItemList(race.languages)
				},
				{
					title: 'Ability Bonuses',
					description: getAbilityScoreDescriptionFromRace(race)
				},
				{
					title: 'Speed',
					description: `${race.speed} ft.`
				},
				{
					title: 'Size',
					description: capitalize(race.size)
				}
		  ] as Descriptor[])
		: [];

	return { descriptors, otherDescriptors };
};
