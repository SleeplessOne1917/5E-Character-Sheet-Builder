import { gql } from 'urql';

const GET_CLASS = gql`
	query Class($index: String) {
		class(index: $index) {
			name
			index
			hit_die
			proficiencies {
				name
				index
				type
			}
			saving_throws {
				index
				full_name
			}
			spellcasting {
				spellcasting_ability {
					index
					full_name
				}
				level
				info {
					name
					desc
				}
			}
			starting_equipment {
				quantity
				equipment {
					index
					name
					... on Pack {
						contents {
							quantity
							item {
								name
								index
							}
						}
					}
				}
			}
			class_levels {
				prof_bonus
				spellcasting {
					cantrips_known
					spell_slots_level_1
					spell_slots_level_2
					spell_slots_level_3
					spell_slots_level_4
					spell_slots_level_5
					spell_slots_level_6
					spell_slots_level_7
					spell_slots_level_8
					spell_slots_level_9
					spells_known
				}
				features {
					index
					name
					desc
				}
				level
			}
			proficiency_choices {
				desc
				choose
				from {
					options {
						... on ProficiencyReferenceOption {
							item {
								name
								index
								type
							}
						}
						... on ProficiencyChoiceOption {
							choice {
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
						}
					}
				}
			}
			starting_equipment_options {
				choose
				desc
				from {
					... on EquipmentCategoryOptionSet {
						equipment_category {
							index
							name
						}
					}
					... on EquipmentOptionSet {
						options {
							... on CountedReferenceOption {
								count
								of {
									index
									name
									... on Pack {
										contents {
											quantity
											item {
												index
												name
											}
										}
									}
								}
								prerequisites {
									type
									proficiency {
										name
										type
										index
									}
								}
							}
							... on EquipmentCategoryChoiceOption {
								choice {
									choose
									from {
										equipment_category {
											index
											name
										}
									}
								}
							}
							... on EquipmentMultipleOption {
								items {
									... on CountedReferenceOption {
										count
										of {
											index
											name
											... on Pack {
												contents {
													quantity
													item {
														index
														name
													}
												}
											}
										}
										prerequisites {
											type
											proficiency {
												index
												name
												type
											}
										}
									}
									... on EquipmentCategoryChoiceOption {
										choice {
											choose
											from {
												equipment_category {
													index
													name
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;

export default GET_CLASS;
