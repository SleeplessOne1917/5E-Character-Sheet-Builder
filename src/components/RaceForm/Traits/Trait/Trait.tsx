import {
	ChangeEventHandler,
	FocusEventHandler,
	useCallback,
	useMemo,
	useState
} from 'react';
import {
	EditingRaceState,
	TraitWithSubtraitsState,
	addTraitHPBonus,
	addTraitProficiencies,
	addTraitProficiencyOptions,
	addTraitSpellOptions,
	addTraitSpells,
	addTraitSubtraits,
	removeTraitHPBonus,
	removeTraitProficiencies,
	removeTraitProficiencyOptions,
	removeTraitSpellOptions,
	removeTraitSpells,
	removeTraitSubtraits,
	setTraitDescription,
	setTraitHPBonus,
	setTraitName,
	setTraitProficiencies,
	setTraitProficiencyOptionsChoose,
	setTraitProficiencyOptionsOptions,
	setTraitSpellOptionsChoose,
	setTraitSpellOptionsOptions,
	setTraitSpells
} from '../../../../redux/features/editingRace';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { ProficiencyType, SrdProficiencyItem } from '../../../../types/srd';

import Button from '../../../Button/Button';
import Checkbox from '../../../Checkbox/Checkbox';
import { Item } from '../../../../types/db/item';
import MarkdownTextArea from '../../../MarkdownTextArea/MarkdownTextArea';
import MultiSelect from '../../../Select/MultiSelect/MultiSelect';
import NumberTextInput from '../../NumberTextInput/NumberTextInput';
import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import { SpellItem } from '../../../../types/characterSheetBuilderAPI';
import SpellsSelector from '../../../Spells/SpellsSelector/SpellsSelector';
import TextInput from '../../../TextInput/TextInput';
import classes from './Trait.module.css';
import { getProficiencyTypeName } from '../../../../services/proficiencyTypeService';
import { useAppDispatch } from '../../../../hooks/reduxHooks';

type TraitProps = {
	index: number;
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
	trait: TraitWithSubtraitsState;
	selectedProficienciesType: ProficiencyType | null;
	setSelectedProficienciesType: (value: ProficiencyType | null) => void;
	selectedProficiencyOptionsType: ProficiencyType | null;
	setSelectedProficiencyOptionsType: (value: ProficiencyType | null) => void;
	onRemove: () => void;
	proficiencies: SrdProficiencyItem[];
	spells: SpellItem[];
};

const Trait = ({
	index,
	shouldUseReduxStore,
	clickedSubmit,
	trait,
	onRemove,
	selectedProficienciesType,
	setSelectedProficienciesType,
	selectedProficiencyOptionsType,
	setSelectedProficiencyOptionsType,
	proficiencies,
	spells
}: TraitProps) => {
	const {
		handleChange,
		handleBlur,
		touched,
		values,
		errors,
		setFieldValue,
		setFieldTouched,
		setFieldError
	} = useFormikContext<EditingRaceState>();
	const dispatch = useAppDispatch();

	const [selectedSpellsSpells, setSelectedSpellsSpells] = useState(
		trait.spells?.map(({ id }) => id) ?? []
	);

	const [selectedSpellOptionsSpells, setSelectedSpellOptionsSpells] = useState(
		trait.spellOptions?.options.map(({ id }) => id) ?? []
	);

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		event => {
			if (shouldUseReduxStore) {
				dispatch(setTraitName({ index, name: event.target.value }));
			}

			handleBlur(event);
		},
		[dispatch, handleBlur, shouldUseReduxStore, index]
	);

	const handleDescriptionChange = useCallback(
		(value: string) => {
			setFieldValue(`traits.${index}.description`, value, false);
		},
		[setFieldValue, index]
	);

	const handleDescriptionBlur: FocusEventHandler<HTMLTextAreaElement> =
		useCallback(
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setTraitDescription({
							index,
							description: event.target.value
						})
					);
				}

				handleBlur(event);
			},
			[dispatch, shouldUseReduxStore, handleBlur, index]
		);

	const handleCheckProficiencies = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addTraitProficiencies(index));
				}

				setFieldValue(`traits.${index}.proficiencies`, [], false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeTraitProficiencies(index));
				}

				setSelectedProficienciesType(null);

				setFieldValue(`traits.${index}.proficiencies`, undefined, false);
			}
		},
		[
			dispatch,
			shouldUseReduxStore,
			setFieldValue,
			index,
			setSelectedProficienciesType
		]
	);

	const handleCheckProficiencyOptions = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addTraitProficiencyOptions(index));
				}

				setFieldValue(
					`traits.${index}.proficiencyOptions`,
					{ options: [] },
					false
				);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeTraitProficiencyOptions(index));
				}

				setSelectedProficiencyOptionsType(null);

				setFieldValue(`traits.${index}.proficiencyOptions`, undefined, false);
			}
		},
		[
			shouldUseReduxStore,
			index,
			setFieldValue,
			dispatch,
			setSelectedProficiencyOptionsType
		]
	);

	const handleCheckHPBonus = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addTraitHPBonus(index));
				}

				setFieldValue(`traits.${index}.hpBonusPerLevel`, null, false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeTraitHPBonus(index));
				}

				setFieldValue(`traits.${index}.hpBonusPerLevel`, undefined, false);
			}
		},
		[shouldUseReduxStore, index, dispatch, setFieldValue]
	);

	const handleCheckSpells = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addTraitSpells(index));
				}

				setFieldValue(`traits.${index}.spells`, [], false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeTraitSpells(index));
				}

				setSelectedSpellsSpells([]);

				setFieldValue(`traits.${index}.spells`, undefined, false);
			}
		},
		[shouldUseReduxStore, dispatch, setFieldValue, index]
	);

	const handleCheckSpellOptions = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addTraitSpellOptions(index));
				}

				setFieldValue(`traits.${index}.spellOptions`, { options: [] }, false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeTraitSpellOptions(index));
				}

				setSelectedSpellOptionsSpells([]);

				setFieldValue(`traits.${index}.spellOptions`, undefined, false);
			}
		},
		[shouldUseReduxStore, dispatch, setFieldValue, index]
	);

	const handleCheckSubtraits = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addTraitSubtraits(index));
				}

				setFieldValue(
					`traits.${index}.subtraitOptions`,
					{ options: [] },
					false
				);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeTraitSubtraits(index));
				}

				setFieldValue(`traits.${index}.subtraitOptions`, undefined, false);
			}
		},
		[shouldUseReduxStore, index, setFieldValue, dispatch]
	);

	const handleProficienciesProficiencyTypeChange = useCallback(
		(value: number | string) => {
			const newValue = value === 'blank' ? null : (value as ProficiencyType);
			const changed = newValue !== selectedProficienciesType;
			setSelectedProficienciesType(newValue);

			if ((trait.proficiencies?.length ?? 0) > 0 && changed) {
				if (shouldUseReduxStore) {
					dispatch(
						setTraitProficiencies({
							index,
							proficiencies: []
						})
					);
				}

				setFieldValue(`traits.${index}.proficiencies`, [], false);
			}
		},
		[
			dispatch,
			setFieldValue,
			index,
			setSelectedProficienciesType,
			shouldUseReduxStore,
			trait.proficiencies?.length,
			selectedProficienciesType
		]
	);

	const handleProficiencyOptionsTypeChange = useCallback(
		(value: number | string) => {
			const newValue = value === 'blank' ? null : (value as ProficiencyType);
			const changed = newValue !== selectedProficiencyOptionsType;
			setSelectedProficiencyOptionsType(newValue);

			if ((trait.proficiencyOptions?.options?.length ?? 0) > 0 && changed) {
				if (shouldUseReduxStore) {
					dispatch(
						setTraitProficiencyOptionsOptions({
							index,
							options: []
						})
					);
				}

				setFieldValue(`traits.${index}.proficiencyOptions.options`, [], false);
			}

			if (changed) {
				if (shouldUseReduxStore) {
					dispatch(setTraitProficiencyOptionsChoose({ index }));
				}

				setFieldValue(
					`traits.${index}.proficiencyOptions.choose`,
					undefined,
					false
				);
			}
		},
		[
			dispatch,
			shouldUseReduxStore,
			index,
			setFieldValue,
			selectedProficiencyOptionsType,
			setSelectedProficiencyOptionsType,
			trait.proficiencyOptions?.options?.length
		]
	);

	const handleProficienciesSelect = useCallback(
		(selectedValues: (string | number)[]) => {
			const newProficiencies = proficiencies
				.filter(prof => selectedValues.includes(prof.index))
				.map<Item>(prof => ({
					id: prof.index,
					name: prof.name
				}));

			if (shouldUseReduxStore) {
				dispatch(
					setTraitProficiencies({
						index,
						proficiencies: newProficiencies
					})
				);
			}

			setFieldValue(`traits.${index}.proficiencies`, newProficiencies, false);
			setFieldTouched(`traits.${index}.proficiencies`, true, false);
			setFieldError(
				`traits.${index}.proficiencies`,
				newProficiencies.length === 0
					? 'Must have at least 1 proficiency'
					: undefined
			);
		},
		[
			dispatch,
			index,
			proficiencies,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			shouldUseReduxStore
		]
	);

	const handleProficiencyOptionsChooseChange: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				setFieldValue(
					`traits.${index}.proficiencyOptions.choose`,
					event.target.value,
					false
				);
			},
			[index, setFieldValue]
		);

	const handleProficiencyOptionsChooseBlur: FocusEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				const parsedValue = parseInt(event.target.value);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;
				if (newValue && newValue < 1) {
					newValue = 1;
				}
				if (
					newValue &&
					selectedProficiencyOptionsType &&
					(trait.proficiencyOptions?.options ?? []).length > 0 &&
					newValue >= (trait.proficiencyOptions?.options ?? []).length
				) {
					newValue = (trait.proficiencyOptions?.options ?? []).length - 1;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setTraitProficiencyOptionsChoose({
							index,
							choose: newValue
						})
					);
				}
				setFieldValue(
					`traits.${index}.proficiencyOptions.choose`,
					newValue,
					false
				);
				setFieldTouched(
					`traits.${index}.proficiencyOptions.choose`,
					true,
					false
				);
				setFieldError(
					`traits.${index}.proficiencyOptions.choose`,
					newValue === 0
						? 'Cannot choose less than 1 proficiency option'
						: !newValue
						? 'Must have number of proficiencies to choose'
						: undefined
				);
			},
			[
				dispatch,
				index,
				setFieldValue,
				setFieldError,
				setFieldTouched,
				shouldUseReduxStore,
				trait.proficiencyOptions?.options,
				selectedProficiencyOptionsType
			]
		);

	const handleProficiencyOptionsSelect = useCallback(
		(selectedValues: (string | number)[]) => {
			const newProficiencies = proficiencies
				.filter(prof => selectedValues.includes(prof.index))
				.map<Item>(prof => ({
					id: prof.index,
					name: prof.name
				}));

			if (shouldUseReduxStore) {
				dispatch(
					setTraitProficiencyOptionsOptions({
						index,
						options: newProficiencies
					})
				);
			}

			setFieldValue(
				`traits.${index}.proficiencyOptions.options`,
				newProficiencies,
				false
			);
			setFieldTouched(
				`traits.${index}.proficiencyOptions.options`,
				true,
				false
			);
			setFieldError(
				`traits.${index}.proficiencyOptions.options`,
				newProficiencies.length === 0
					? 'Must have at least 1 proficiency to choose from'
					: undefined
			);

			if (
				(trait.proficiencyOptions?.choose ?? 0) >= newProficiencies.length &&
				(trait.proficiencyOptions?.choose ?? 0) > 0
			) {
				const newChoose = newProficiencies.length - 1;
				if (shouldUseReduxStore) {
					dispatch(
						setTraitProficiencyOptionsChoose({
							index,
							choose: newChoose
						})
					);
				}
				setFieldValue(
					`traits.${index}.proficiencyOptions.choose`,
					newChoose,
					false
				);
				setFieldError(
					`traits.${index}.proficiencyOptions.choose`,
					newChoose === 0
						? 'Cannot choose less than 1 proficiency option'
						: undefined
				);
			}
		},
		[
			dispatch,
			index,
			setFieldError,
			setFieldValue,
			setFieldTouched,
			proficiencies,
			shouldUseReduxStore,
			trait.proficiencyOptions?.choose
		]
	);

	const handleHPBonusChange: ChangeEventHandler<HTMLInputElement> = useCallback(
		event => {
			setFieldValue(
				`traits.${index}.hpBonusPerLevel`,
				event.target.value,
				false
			);
		},
		[setFieldValue, index]
	);

	const handleHPBonusBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		event => {
			const parsedValue = parseInt(event.target.value);
			let newValue = !isNaN(parsedValue) ? parsedValue : null;
			if (newValue !== null && newValue < 1) {
				newValue = 1;
			}
			if (newValue && newValue > 10) {
				newValue = 10;
			}

			if (shouldUseReduxStore) {
				dispatch(
					setTraitHPBonus({
						index,
						hpBonus: newValue
					})
				);
			}

			setFieldValue(`traits.${index}.hpBonusPerLevel`, newValue, false);
			setFieldTouched(`traits.${index}.hpBonusPerLevel`, true, false);
		},
		[shouldUseReduxStore, dispatch, setFieldTouched, setFieldValue, index]
	);

	const filterSpellsSpell = useCallback(
		(spell: SpellItem) =>
			!(
				values.traits
					.flatMap(t => t.spells ?? [])
					.concat(values.traits.flatMap(t => t.spellOptions?.options ?? []))
					.some(t => t.id === spell.id) &&
				!selectedSpellsSpells?.some(s => s === spell.id)
			),
		[values.traits, selectedSpellsSpells]
	);

	const filterSpellOptionsSpell = useCallback(
		(spell: SpellItem) =>
			!(
				values.traits
					.flatMap(t => t.spells ?? [])
					.concat(values.traits.flatMap(t => t.spellOptions?.options ?? []))
					.some(t => t.id === spell.id) &&
				!selectedSpellOptionsSpells?.some(s => s === spell.id)
			),
		[values.traits, selectedSpellOptionsSpells]
	);

	const handleSpellsAdd = useCallback(
		(spell: SpellItem) => {
			const newSpells = [
				...(trait.spells ?? []),
				{ id: spell.id, name: spell.name }
			];

			if (shouldUseReduxStore) {
				dispatch(setTraitSpells({ index, spells: newSpells }));
			}

			setSelectedSpellsSpells(prev => [...prev, spell.id]);

			setFieldValue(`traits.${index}.spells`, newSpells, false);
		},
		[index, dispatch, setFieldValue, shouldUseReduxStore, trait.spells]
	);

	const handleSpellsRemove = useCallback(
		(spell: SpellItem) => {
			const newSpells = [...(trait.spells ?? [])].filter(
				s => s.id !== spell.id
			);

			if (shouldUseReduxStore) {
				dispatch(setTraitSpells({ index, spells: newSpells }));
			}

			setSelectedSpellsSpells(prev => prev.filter(s => s !== spell.id));

			setFieldValue(`traits.${index}.spells`, newSpells, false);
		},
		[index, dispatch, setFieldValue, shouldUseReduxStore, trait.spells]
	);

	const handleSpellOptionsChooseChange: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				setFieldValue(
					`traits.${index}.spellOptions.choose`,
					event.target.value,
					false
				);
			},
			[index, setFieldValue]
		);

	const handleSpellOptionsChooseBlur: FocusEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				const parsedValue = parseInt(event.target.value);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue && newValue < 1) {
					newValue = 1;
				}

				const maxSize = (trait.spellOptions?.options ?? []).length;

				if (newValue && newValue > maxSize) {
					newValue = maxSize;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setTraitProficiencyOptionsChoose({
							index,
							choose: newValue
						})
					);
				}
				setFieldValue(`traits.${index}.spellOptions.choose`, newValue, false);
				setFieldTouched(`traits.${index}.spellOptions.choose`, true, false);
				setFieldError(
					`traits.${index}.spellOptions.choose`,
					newValue === 0
						? 'Must have at least 1 spell to choose from'
						: !newValue
						? 'Must have spells to choose from'
						: undefined
				);
			},
			[
				dispatch,
				index,
				shouldUseReduxStore,
				setFieldError,
				setFieldTouched,
				setFieldValue,
				trait.spellOptions?.options
			]
		);

	const handleSpellOptionsAdd = useCallback(
		(spell: SpellItem) => {
			const newSpells = [
				...(trait.spellOptions?.options ?? []),
				{ id: spell.id, name: spell.name }
			];

			if (shouldUseReduxStore) {
				dispatch(setTraitSpellOptionsOptions({ index, options: newSpells }));
			}

			setSelectedSpellOptionsSpells(prev => [...prev, spell.id]);

			setFieldValue(`traits.${index}.spellOptions.options`, newSpells, false);
		},
		[
			index,
			dispatch,
			setFieldValue,
			shouldUseReduxStore,
			trait.spellOptions?.options
		]
	);

	const handleSpellOptionsRemove = useCallback(
		(spell: SpellItem) => {
			const newSpells = [...(trait.spellOptions?.options ?? [])].filter(
				s => s.id !== spell.id
			);

			if (shouldUseReduxStore) {
				dispatch(setTraitSpellOptionsOptions({ index, options: newSpells }));
			}

			setSelectedSpellOptionsSpells(prev => prev.filter(s => s !== spell.id));

			setFieldValue(`traits.${index}.spellOptions.options`, newSpells, false);

			if ((trait.spellOptions?.choose ?? 0) > newSpells.length) {
				if (shouldUseReduxStore) {
					dispatch(
						setTraitSpellOptionsChoose({ index, choose: newSpells.length })
					);
				}

				setFieldValue(
					`traits.${index}.spellOptions.choose`,
					newSpells.length,
					false
				);
			}
		},
		[
			index,
			dispatch,
			setFieldValue,
			shouldUseReduxStore,
			trait.spellOptions?.options,
			trait.spellOptions?.choose
		]
	);

	const proficiencyTypeOptions = useMemo(
		() =>
			proficiencies.reduce<Option[]>(
				(acc, { type }) =>
					!acc.some(({ value }) => value === type)
						? [...acc, { value: type, label: getProficiencyTypeName(type) }]
						: acc,
				[{ label: '\u2014', value: 'blank' }]
			),
		[proficiencies]
	);

	const proficienciesOptions = useMemo(
		() =>
			proficiencies
				.filter(
					prof =>
						prof.type === selectedProficienciesType &&
						!(
							values.traits
								.flatMap(t => t.proficiencies ?? [])
								.concat(
									values.traits.flatMap(
										t => t.proficiencyOptions?.options ?? []
									)
								)
								.some(tp => tp.id === prof.index) &&
							!(trait.proficiencies ?? []).some(tp => tp.id === prof.index)
						)
				)
				.map(prof => ({
					label: prof.name.replace(/Skill: /g, ''),
					value: prof.index
				})),
		[
			proficiencies,
			selectedProficienciesType,
			trait.proficiencies,
			values.traits
		]
	);

	const proficiencyOptionsOptions = useMemo(
		() =>
			proficiencies
				.filter(
					prof =>
						prof.type === selectedProficiencyOptionsType &&
						!(
							values.traits
								.flatMap(t => t.proficiencies ?? [])
								.concat(
									values.traits.flatMap(
										t => t.proficiencyOptions?.options ?? []
									)
								)
								.some(tp => tp.id === prof.index) &&
							!(trait.proficiencyOptions?.options ?? []).some(
								tp => tp.id === prof.index
							)
						)
				)
				.map(prof => ({
					label: prof.name.replace(/Skill: /g, ''),
					value: prof.index
				})),
		[
			proficiencies,
			selectedProficiencyOptionsType,
			trait.proficiencyOptions?.options,
			values.traits
		]
	);

	const levels = [...new Array(10).keys()];

	return (
		<div className={classes.trait}>
			<Button
				size="small"
				style={{
					position: 'absolute',
					top: '-0.3rem',
					right: '-0.3rem',
					borderTopRightRadius: '0.75rem'
				}}
				onClick={onRemove}
			>
				Remove trait
			</Button>
			<TextInput
				label="Trait Name"
				id={`traits.${index}.name`}
				onChange={handleChange}
				onBlur={handleNameBlur}
				value={trait.name ?? ''}
				touched={
					clickedSubmit || (touched.traits && touched.traits[index]?.name)
				}
				error={
					errors.traits
						? (errors.traits[index] as FormikErrors<{ name: string }>)?.name
						: undefined
				}
			/>
			<div style={{ alignSelf: 'stretch', marginTop: '1.5rem' }}>
				<MarkdownTextArea
					id={`traits.${index}.description`}
					label="Description"
					touched={
						clickedSubmit ||
						(touched.traits && touched.traits[index]?.description)
					}
					error={
						errors.traits
							? (
									errors.traits[index] as FormikErrors<{
										description: string;
									}>
							  )?.description
							: undefined
					}
					value={trait.description}
					onChange={handleDescriptionChange}
					onBlur={handleDescriptionBlur}
				/>
				<div className={classes['checkbox-deck']}>
					<Checkbox
						label="Proficiencies"
						checked={!!trait.proficiencies}
						onChange={handleCheckProficiencies}
					/>
					<Checkbox
						label="Proficiency Options"
						checked={!!trait.proficiencyOptions}
						onChange={handleCheckProficiencyOptions}
					/>
					<Checkbox
						label="HP Bonus per Level"
						checked={trait.hpBonusPerLevel !== undefined}
						onChange={handleCheckHPBonus}
					/>
					<Checkbox
						label="Spells"
						checked={!!trait.spells}
						onChange={handleCheckSpells}
					/>
					<Checkbox
						label="Spell Options"
						checked={!!trait.spellOptions}
						onChange={handleCheckSpellOptions}
					/>
					<Checkbox
						label="Subtraits"
						checked={!!trait.subtraitOptions}
						onChange={handleCheckSubtraits}
					/>
				</div>
				{trait.proficiencies && (
					<div className={classes['extra-deck']}>
						<Select
							options={proficiencyTypeOptions}
							label="Proficiency type"
							id={`traits.${index}.proficiencyType`}
							touched={
								clickedSubmit ||
								(touched.traits &&
									touched.traits[index] &&
									touched.traits[index].proficiencies)
							}
							error={
								errors.traits &&
								errors.traits[index] &&
								!selectedProficienciesType
									? ((
											errors.traits[index] as FormikErrors<{
												proficiencies: Item[];
											}>
									  ).proficiencies as string)
									: undefined
							}
							value={selectedProficienciesType ?? 'blank'}
							onChange={handleProficienciesProficiencyTypeChange}
						/>
						{trait.proficiencies && trait.proficiencies.length > 0 && (
							<p style={{ maxWidth: '30rem' }}>
								{trait.proficiencies
									.map(({ name }) => name.replace(/Skill: /g, ''))
									.join(', ')}
							</p>
						)}
						{selectedProficienciesType && (
							<MultiSelect
								options={proficienciesOptions}
								values={(trait.proficiencies ?? []).map(({ id }) => id)}
								label="Proficiencies"
								id={`traits.${index}.proficiencies`}
								touched={
									clickedSubmit ||
									(touched.traits &&
										touched.traits[index] &&
										touched.traits[index].proficiencies)
								}
								error={
									errors.traits && errors.traits[index]
										? ((
												errors.traits[index] as FormikErrors<{
													proficiencies: Item[];
												}>
										  ).proficiencies as string)
										: undefined
								}
								onSelect={handleProficienciesSelect}
							/>
						)}
					</div>
				)}
				{trait.proficiencyOptions && (
					<div className={classes['extra-deck']}>
						<NumberTextInput
							id={`traits.${index}.proficiencyOptions.choose`}
							label="Number of proficiency options"
							value={trait.proficiencyOptions.choose}
							touched={
								clickedSubmit ||
								(touched.traits &&
									touched.traits[index] &&
									(
										touched.traits[index].proficiencyOptions as FormikTouched<{
											choose: number;
										}>
									)?.choose)
							}
							error={
								errors.traits && errors.traits[index]
									? (
											errors.traits[index] as FormikErrors<{
												proficiencyOptions: { choose: number };
											}>
									  ).proficiencyOptions?.choose
									: undefined
							}
							onChange={handleProficiencyOptionsChooseChange}
							onBlur={handleProficiencyOptionsChooseBlur}
						/>
						<Select
							options={proficiencyTypeOptions}
							label="Proficiency type"
							id={`traits.${index}.proficiencyOptions.proficiencyType`}
							value={selectedProficiencyOptionsType ?? 'blank'}
							touched={
								clickedSubmit ||
								(touched.traits &&
									touched.traits[index] &&
									touched.traits[index].proficiencyOptions &&
									!!(
										touched.traits[index].proficiencyOptions as FormikTouched<{
											options: Item[];
										}>
									).options)
							}
							error={
								errors.traits &&
								errors.traits[index] &&
								(
									errors.traits[index] as FormikErrors<{
										proficiencyOptions: { options: Item[] };
									}>
								).proficiencyOptions &&
								!selectedProficiencyOptionsType
									? ((
											errors.traits[index] as FormikErrors<{
												proficiencyOptions: { options: Item[] };
											}>
									  ).proficiencyOptions?.options as string)
									: undefined
							}
							onChange={handleProficiencyOptionsTypeChange}
						/>
						{trait.proficiencyOptions &&
							trait.proficiencyOptions.options.length > 0 && (
								<p style={{ maxWidth: '10rem' }}>
									{trait.proficiencyOptions.options
										.map(({ name }) => name.replace(/Skill: /g, ''))
										.join(', ')}
								</p>
							)}
						{selectedProficiencyOptionsType && (
							<MultiSelect
								options={proficiencyOptionsOptions}
								values={(trait.proficiencyOptions.options ?? []).map(
									({ id }) => id
								)}
								label="Proficiency Options"
								id={`traits.${index}.proficiencyOptions.options`}
								touched={
									clickedSubmit ||
									(touched.traits &&
										touched.traits[index] &&
										touched.traits[index].proficiencyOptions &&
										!!(
											touched.traits[index]
												.proficiencyOptions as FormikTouched<{
												options: Item[];
											}>
										).options)
								}
								error={
									errors.traits && errors.traits[index]
										? ((
												errors.traits[index] as FormikErrors<{
													proficiencyOptions: { options: Item[] };
												}>
										  ).proficiencyOptions?.options as string)
										: undefined
								}
								onSelect={handleProficiencyOptionsSelect}
							/>
						)}
					</div>
				)}
				{trait.hpBonusPerLevel !== undefined && (
					<div className={classes['extra-deck']}>
						<NumberTextInput
							id={`traits.${index}.hpBonusPerLevel`}
							label="HP Bonus per Level"
							value={trait.hpBonusPerLevel}
							touched={
								clickedSubmit ||
								(touched.traits &&
									touched.traits[index] &&
									touched.traits[index]?.hpBonusPerLevel)
							}
							error={
								errors.traits && errors.traits[index]
									? (
											errors.traits[index] as FormikErrors<{
												hpBonusPerLevel: number;
											}>
									  )?.hpBonusPerLevel
									: undefined
							}
							onChange={handleHPBonusChange}
							onBlur={handleHPBonusBlur}
						/>
					</div>
				)}
				{trait.spells && (
					<div className={classes['extra-deck']}>
						{trait.spells && trait.spells.length > 0 && (
							<p style={{ maxWidth: '30rem' }}>
								{trait.spells.map(({ name }) => name).join(', ')}
							</p>
						)}
						<SpellsSelector
							spells={spells}
							label="Spells"
							filterSpell={filterSpellsSpell}
							selectedSpells={selectedSpellsSpells}
							levels={levels}
							onAdd={handleSpellsAdd}
							onRemove={handleSpellsRemove}
						/>
					</div>
				)}
				{trait.spellOptions && (
					<div
						className={classes['extra-deck']}
						style={{
							flexWrap: 'nowrap',
							flexDirection: 'column',
							alignItems: 'center'
						}}
					>
						<NumberTextInput
							id={`traits.${index}.spellOptions.choose`}
							label="Number of Spells to Choose From"
							value={trait.spellOptions.choose}
							touched={
								clickedSubmit ||
								(touched.traits &&
									touched.traits[index] &&
									(
										touched.traits[index].spellOptions as FormikTouched<{
											choose: number;
										}>
									).choose)
							}
							error={
								errors.traits && errors.traits[index]
									? (
											errors.traits[index] as FormikErrors<{
												spellOptions: { choose: number };
											}>
									  ).spellOptions?.choose
									: undefined
							}
							onChange={handleSpellOptionsChooseChange}
							onBlur={handleSpellOptionsChooseBlur}
						/>
						{trait.spellOptions.options &&
							trait.spellOptions.options.length > 0 && (
								<p style={{ maxWidth: '30rem' }}>
									{trait.spellOptions.options
										.map(({ name }) => name)
										.join(', ')}
								</p>
							)}
						<SpellsSelector
							spells={spells}
							label="Spell Options"
							levels={levels}
							selectedSpells={selectedSpellOptionsSpells}
							filterSpell={filterSpellOptionsSpell}
							onAdd={handleSpellOptionsAdd}
							onRemove={handleSpellOptionsRemove}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Trait;
