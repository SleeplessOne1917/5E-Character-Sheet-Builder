import { CastingTime } from '../types/srd';

export const prettifyCastingTime = (castingTime: CastingTime) => {
	switch (castingTime) {
		case 'ACTION':
			return '1 action';
		case 'BONUS_ACTION':
			return '1 bonus action';
		case 'DAY':
			return '24 hours';
		case 'HOUR':
			return '1 hour';
		case 'MINUTE':
			return '1 minute';
		case 'MINUTES_10':
			return '10 minutes';
		case 'REACTION':
			return '1 reaction';
	}
};
