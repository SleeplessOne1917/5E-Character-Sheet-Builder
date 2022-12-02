import { gql } from 'urql/core';

const GET_RACE = gql`
	query GetRace($id: ID!) {
		race(id: $id) {
			id
			name
			abilityBonuses {
				abilityScore {
					id
					name
				}
				bonus
			}
			abilityBonusOptions {
				bonus
				numberOfAbilityScores
			}
			languages {
				id
				name
			}
			numberOfLanguageOptions
			size
			speed
			traits {
				name
				description
				hpBonusPerLevel
				proficiencies {
					id
					name
				}
				proficiencyOptions {
					choose
					options {
						id
						name
					}
				}
				spells {
					id
					name
				}
				spellOptions {
					choose
					options {
						id
						name
					}
				}
				subtraitOptions {
					choose
					options {
						name
						description
						hpBonusPerLevel
						proficiencies {
							id
							name
						}
						proficiencyOptions {
							choose
							options {
								id
								name
							}
						}
						spells {
							id
							name
						}
						spellOptions {
							choose
							options {
								id
								name
							}
						}
					}
				}
			}
		}
	}
`;

export default GET_RACE;
