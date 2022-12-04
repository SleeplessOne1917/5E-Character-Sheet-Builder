import { Race, Subrace } from '../types/characterSheetBuilderAPI';

import { Descriptor } from '../types/creation';
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

export const getSubraceDescriptors = (subrace?: Subrace) => {
	const descriptors = subrace?.traits?.map<Descriptor>(trait => ({
		title: trait.name,
		description: trait.description
	}));

	const otherDescriptors: Descriptor[] = [];

	if (subrace?.languages) {
		otherDescriptors.push({
			title: 'Languages',
			description: formatItemList(subrace.languages)
		});
	}

	if (subrace?.abilityBonuses || subrace?.abilityBonusOptions) {
		otherDescriptors.push({
			title: 'Ability Bonuses',
			description: getAbilityScoreDescriptionFromRace(subrace)
		});
	}

	if (subrace?.speed) {
		otherDescriptors.push({
			title: 'Speed',
			description: `${subrace.speed} ft.`
		});
	}

	if (subrace?.size) {
		otherDescriptors.push({
			title: 'Size',
			description: capitalize(subrace.size)
		});
	}

	return { descriptors, otherDescriptors };
};
