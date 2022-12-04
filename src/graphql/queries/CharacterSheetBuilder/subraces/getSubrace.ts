import { gql } from 'urql/core';

const GET_SUBRACE = gql`
	query GetSubrace($id: ID!) {
		subrace(id: $id) {
			id
			name
			race {
				id
				name
			}
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
			omittedRaceTraits
			traits {
				uuid
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
						uuid
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

export default GET_SUBRACE;
