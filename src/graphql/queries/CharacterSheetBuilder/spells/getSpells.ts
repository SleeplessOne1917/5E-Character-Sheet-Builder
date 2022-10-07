import { gql } from 'urql';

const GET_SPELLS = gql`
	query GetSpells($limit: Int) {
		spells(limit: $limit) {
			id
			name
			level
			castingTime
			duration
			range
			school {
				id
				name
			}
			components
			material
			concentration
			ritual
			description
			atHigherLevels
			damageType {
				id
				name
			}
			classes {
				id
				name
			}
			summons {
				name
				size
				type
				armorClass
				hitPoints
				speed
				strength
				dexterity
				constitution
				wisdom
				intelligence
				charisma
				conditionImmunities
				damageResistances
				damageImmunities
				skills
				savingThrows
				senses
				languages
				proficiencyBonus
				specialAbilities {
					name
					description
				}
				actions {
					name
					description
				}
				bonusActions {
					name
					description
				}
				reactions {
					name
					description
				}
			}
		}
	}
`;

export default GET_SPELLS;
