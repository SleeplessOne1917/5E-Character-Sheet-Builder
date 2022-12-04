import CREATE_SUBRACE from '../../../graphql/mutations/subrace/createSubrace';
import { Subrace } from '../../../types/characterSheetBuilderAPI';
import { useMutation } from 'urql';

const useCreateSubrace = () =>
	useMutation<string, { subrace: Omit<Subrace, 'id'> }>(CREATE_SUBRACE);

export default useCreateSubrace;
