import { AnyVariables, Operation, OperationResult } from 'urql';

import { Data } from '@urql/exchange-graphcache';

type OperationData<T extends Operation> = T extends Operation<infer Data>
	? Data
	: any;

type OperationVariables<T extends Operation> = T extends Operation<
	Data,
	infer Variables
>
	? Variables
	: AnyVariables;

type UrqlParameterResponse<
	Data = any,
	Variables extends AnyVariables = AnyVariables
> = OperationResult<Data, Variables>;

type UrqlResponse<T extends Operation> = UrqlParameterResponse<
	OperationData<T>,
	OperationVariables<T>
>;

export type { UrqlResponse };
