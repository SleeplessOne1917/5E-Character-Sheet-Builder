import { gql } from 'urql';

const GET_SUBRACE = gql`
	query GetSubrace($index: String) {
		subrace(index: $index) {
			desc
			index
			name
			ability_bonuses {
				bonus
				ability_score {
					index
					full_name
				}
			}
			racial_traits {
				name
				index
				desc
				proficiencies {
					name
					index
					type
				}
				proficiency_choices {
					choose
					from {
						options {
							... on ProficiencyReferenceOption {
								item {
									index
									name
									type
								}
							}
						}
					}
				}
				language_options {
					choose
					from {
						options {
							item {
								name
								index
							}
						}
					}
				}
				trait_specific {
					spell_options {
						choose
						from {
							options {
								item {
									index
									name
									level
									components
									casting_time
									concentration
									desc
									classes {
										index
										name
									}
									duration
									higher_level
									school {
										name
										index
									}
									damage {
										damage_type {
											name
											index
										}
									}
									material
									range
									ritual
								}
							}
						}
					}
				}
			}
		}
	}
`;

export default GET_SUBRACE;
