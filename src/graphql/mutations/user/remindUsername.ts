import { gql } from 'urql/core';

const REMIND_USERNAME = gql`
	mutation RemindUsername($otlId: String!) {
		remindUsername(otlId: $otlId)
	}
`;

export default REMIND_USERNAME;
