import { Operation } from 'urql';
import { UrqlResponse } from '../types/urqlTypes';

export const getUrqlParameter = <T extends Operation>(
	operation: T,
	callback: (op: T) => Promise<UrqlResponse<T>> | UrqlResponse<T>
) => callback(operation);
