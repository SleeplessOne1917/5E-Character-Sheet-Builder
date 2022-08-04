import { gql } from 'urql';

const GET_RACE = gql`
	query GetRace($index: String) {
		race(index: $index) {
			ability_bonuses {
				ability_score {
					index
					full_name
				}
				bonus
			}
			ability_bonus_options {
				choose
				from {
					options {
						bonus
						ability_score {
							index
							full_name
						}
					}
				}
			}
			age
			alignment
			index
			language_desc
			languages {
				index
				name
			}
			language_options {
				from {
					options {
						item {
							name
							index
						}
					}
				}
				choose
			}
			name
			size
			size_description
			speed
			traits {
				name
				index
				desc
				proficiencies {
					index
					name
				}
				proficiency_choices {
					choose
					from {
						options {
							... on ProficiencyReferenceOption {
								item {
									name
									index
								}
							}
						}
					}
				}
			}
		}
	}
`;

export default GET_RACE;
