import raceQueryResolvers from './query/race';
import spellQueryResolvers from './query/spell';

const Query = {
	...spellQueryResolvers,
	...raceQueryResolvers
};

export default Query;
