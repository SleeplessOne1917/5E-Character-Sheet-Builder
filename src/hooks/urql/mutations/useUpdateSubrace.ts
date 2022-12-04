import { Subrace } from '../../../types/characterSheetBuilderAPI';
import UPDATE_SUBRACE from '../../../graphql/mutations/subrace/updateSubrace';
import { useMutation } from 'urql';

const useUpdateSubrace = () =>
	useMutation<string, { id: string; subrace: Omit<Subrace, 'id'> }>(
		UPDATE_SUBRACE
	);

export default useUpdateSubrace;
