import { gql } from 'urql';

const REMIND_USERNAME = gql`
	mutation RemindUsername($otlId: String!) {
		remindUsername(otlId: $otlId)
	}
`;

export default REMIND_USERNAME;
