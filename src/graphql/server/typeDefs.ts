import { gql } from 'urql';

const typeDefs = gql`
	input LoginRequest {
		username: String!
		password: String!
	}

	input SignUpRequest {
		username: String!
		password: String!
		email: String
	}

	type ForgotResponse {
		message: String!
	}

	input ForgotUsernameRequest {
		email: String!
	}

	input ForgotPasswordRequest {
		email: String!
		username: String!
	}

	enum Size {
		TINY
		SMALL
		MEDIUM
		LARGE
		HUGE
		GARGANTUAN
	}

	enum MonsterType {
		BEAST
		MONSTROSITY
		DRAGON
		HUMANOID
		UNDEAD
		FIEND
		CELESTIAL
		CONSTRUCT
		GIANT
		ELEMENTAL
		FEY
		ABERRATION
		OOZE
		PLANT
	}

	enum SpellComponent {
		V
		S
		M
	}

	type NameDescription {
		name: String!
		description: String!
	}

	input NameDescriptionInput {
		name: String!
		description: String!
	}

	type Summon {
		name: String!
		size: Size!
		type: MonsterType!
		armorClass: String!
		hitPoints: String!
		speed: String!
		strength: Int!
		dexterity: Int!
		constitution: Int!
		wisdom: Int!
		charisma: Int!
		intelligence: Int!
		conditionImmunities: String
		damageResistances: String
		damageImmunities: String
		skills: String
		savingThrows: String
		senses: String!
		languages: String!
		proficiencyBonus: String!
		specialAbilities: [NameDescription!]
		actions: [NameDescription!]!
		bonusActions: [NameDescription!]
		reactions: [NameDescription!]
	}

	input SummonInput {
		name: String!
		size: Size!
		type: MonsterType!
		armorClass: String!
		hitPoints: String!
		speed: String!
		strength: Int!
		dexterity: Int!
		constitution: Int!
		wisdom: Int!
		charisma: Int!
		intelligence: Int!
		conditionImmunities: String
		damageResistances: String
		damageImmunities: String
		skills: String
		savingThrows: String
		senses: String!
		languages: String!
		proficiencyBonus: String!
		specialAbilities: [NameDescriptionInput!]
		actions: [NameDescriptionInput!]!
		bonusActions: [NameDescriptionInput!]
		reactions: [NameDescriptionInput!]
	}

	input ItemInput {
		id: String!
		name: String!
	}

	type Item {
		id: String!
		name: String!
	}

	input SpellInput {
		name: String!
		level: Int!
		castingTime: String!
		duration: String!
		range: String!
		school: ItemInput!
		components: [SpellComponent!]!
		material: String
		concentration: Boolean
		ritual: Boolean
		description: String!
		atHigherLevels: String
		damageType: ItemInput
		classes: [ItemInput!]!
		summons: [SummonInput!]
	}

	type Spell {
		id: ID!
		name: String!
		level: Int!
		castingTime: String!
		duration: String!
		range: String!
		school: Item!
		components: [SpellComponent!]!
		material: String
		concentration: Boolean
		ritual: Boolean
		description: String!
		atHigherLevels: String
		damageType: Item
		classes: [Item!]!
		summons: [Summon!]
	}

	type SpellsResponse {
		count: Int!
		spells: [Spell!]!
	}

	input AbilityBonusInput {
		abilityScore: ItemInput!
		bonus: Int!
	}

	input AbilityBonusOptionsInput {
		bonus: Int!
		numberOfAbilityScores: Int!
	}

	input ChooseOptionsInput {
		choose: Int!
		options: [ItemInput!]!
	}

	input SubtraitInput {
		name: String!
		description: String!
		hpBonusPerLevel: Int
		proficiencies: [ItemInput!]
		proficiencyOptions: ChooseOptionsInput
		spells: [ItemInput!]
		spellOptions: ChooseOptionsInput
	}

	input SubtraitOptionsInput {
		choose: Int!
		options: [SubtraitInput!]!
	}

	input TraitInput {
		name: String!
		description: String!
		hpBonusPerLevel: Int
		proficiencies: [ItemInput!]
		proficiencyOptions: ChooseOptionsInput
		spells: [ItemInput!]
		spellOptions: ChooseOptionsInput
		subtraitOptions: SubtraitOptionsInput
	}

	input RaceInput {
		name: String!
		abilityBonuses: [AbilityBonusInput!]!
		abilityBonusOptions: AbilityBonusOptionsInput
		languages: [ItemInput!]!
		numberOfLanguageOptions: Int
		size: Size!
		speed: Int!
		traits: [TraitInput!]
	}

	type Query {
		viewer: String
		spells(
			limit: Int
			skip: Int
			name: String
			level: Int
			school: String
			class: String
		): SpellsResponse!
		spell(id: ID!): Spell!
	}

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
	}
`;

export default typeDefs;
