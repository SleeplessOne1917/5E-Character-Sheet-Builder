import raceQueryResolvers from './query/race';
import spellQueryResolvers from './query/spell';
import subraceQueryResolvers from './query/subrace';

const Query = {
	...spellQueryResolvers,
	...raceQueryResolvers,
	...subraceQueryResolvers
};

export default Query;
