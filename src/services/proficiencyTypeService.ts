import { ProficiencyType } from './../types/srd';

export const getProficiencyTypeName = (type: ProficiencyType) => {
	switch (type) {
		case 'ARMOR':
			return 'Armor';
		case 'ARTISANS_TOOLS':
			return "Artisan's Tools";
		case 'GAMING_SETS':
			return 'Gaming Sets';
		case 'MUSICAL_INSTRUMENTS':
			return 'Musical Instruments';
		case 'OTHER':
			return 'Other';
		case 'SKILLS':
			return 'Skills';
		case 'VEHICLES':
			return 'Vehicles';
		case 'WEAPONS':
			return 'Weapon';
		default:
			return '';
	}
};
