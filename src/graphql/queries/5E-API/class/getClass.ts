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
				ability_score_bonuses
				features {
					index
					name
					desc
					feature_specific {
						subfeature_options {
							choose
							from {
								options {
									item {
										index
										name
										desc
										prerequisites {
											feature {
												name
												index
											}
											spell {
												index
												name
											}
											level
										}
									}
								}
							}
						}
					}
					prerequisites {
						feature {
							name
							index
						}
						spell {
							index
							name
						}
						level
					}
				}
				level
				subclass {
					index
					name
				}
				class_specific {
					... on BarbarianSpecific {
						rage_count
						rage_damage_bonus
					}
					... on MonkSpecific {
						martial_arts {
							dice_count
							dice_value
						}
						ki_points
						unarmored_movement
					}
					... on RogueSpecific {
						sneak_attack {
							dice_count
							dice_value
						}
					}
					... on SorcererSpecific {
						sorcery_points
						metamagic_known
					}
					... on WarlockSpecific {
						invocations_known
					}
				}
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
			subclasses {
				index
				name
				subclass_flavor
				desc
				spells {
					prerequisites {
						... on Level {
							level
						}
						... on Feature {
							index
							name
						}
					}
					spell {
						index
						name
						level
						components
						casting_time
						concentration
						desc
						duration
						higher_level
						school {
							index
							name
						}
						damage {
							damage_type {
								index
								name
							}
						}
						material
						range
						ritual
					}
				}
				subclass_levels {
					level
					features {
						name
						index
						desc
						feature_specific {
							subfeature_options {
								choose
								from {
									options {
										item {
											index
											name
											desc
											prerequisites {
												feature {
													name
													index
												}
												spell {
													index
													name
												}
												level
											}
										}
									}
								}
							}
						}
						prerequisites {
							feature {
								name
								index
							}
							spell {
								index
								name
							}
							level
						}
					}
				}
			}
		}
	}
`;

export default GET_CLASS;
