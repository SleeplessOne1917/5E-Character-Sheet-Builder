import { gql } from 'urql/core';

const typeDefs = gql`
	type Mutation {
		signUp(user: SignUpRequest!): String!
		logIn(user: LoginRequest!): String!
		logout: String!
		forgotUsername(request: ForgotUsernameRequest!): ForgotResponse!
		forgotPassword(request: ForgotPasswordRequest!): ForgotResponse!
		remindUsername(otlId: String!): String!
		validateResetPassword(otlId: String!): String!
		resetPassword(
			otlId: String!
			password: String!
			confirmPassword: String!
		): String!
		createNewPassword(
			currentPassword: String!
			newPassword: String!
			confirmPassword: String!
		): String!
		createSpell(spell: SpellInput!): String!
		updateSpell(id: ID!, spell: SpellInput!): String!
		createRace(race: RaceInput!): String!
		updateRace(id: ID!, race: RaceInput!): String!
		createSubrace(subrace: SubraceInput!): String!
	}
`;

export default typeDefs;
