import authMutationResolvers from './mutation/auth';
import forgoMutationtResolvers from './mutation/forgot';
import raceMutationResolvers from './mutation/race';
import spellMutationResolvers from './mutation/spell';
import subraceMutationResolvers from './mutation/subrace';

const Mutation = {
	...authMutationResolvers,
	...forgoMutationtResolvers,
	...raceMutationResolvers,
	...spellMutationResolvers,
	...subraceMutationResolvers
};

export default Mutation;
