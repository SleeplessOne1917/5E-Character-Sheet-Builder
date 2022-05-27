import { DocumentNode, Kind, OperationDefinitionNode } from 'graphql';

import { TypedDocumentNode } from '@urql/core';

export const getQueryName = (
	query: DocumentNode | TypedDocumentNode<any, any>
): string => {
	if (query.definitions[0].kind === Kind.OPERATION_DEFINITION) {
		const operation = query.definitions[0] as OperationDefinitionNode;
		return operation.name?.value ?? '';
	}

	return '';
};
