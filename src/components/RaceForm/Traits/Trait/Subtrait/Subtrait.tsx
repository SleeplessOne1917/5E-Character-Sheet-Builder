import {
	ChangeEventHandler,
	FocusEventHandler,
	useCallback,
	useMemo,
	useState
} from 'react';
import {
	EditingRaceState,
	TraitState,
	addSubtraitHPBonus,
	addSubtraitProficiencies,
	addSubtraitProficiencyOptions,
	addSubtraitSpellOptions,
	addSubtraitSpells,
	removeSubtraitHPBonus,
	removeSubtraitProficiencies,
	removeSubtraitProficiencyOptions,
	removeSubtraitSpellOptions,
	removeSubtraitSpells,
	setSubtraitDescription,
	setSubtraitHPBonus,
	setSubtraitName,
	setSubtraitProficiencies,
	setSubtraitProficiencyOptionsChoose,
	setSubtraitProficiencyOptionsOptions,
	setSubtraitSpellOptionsChoose,
	setSubtraitSpellOptionsOptions,
	setSubtraitSpells
} from '../../../../../redux/features/editingRace';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { ProficiencyType, SrdProficiencyItem } from '../../../../../types/srd';

import Button from '../../../../Button/Button';
import CheckboxDeck from '../CheckboxDeck/CheckboxDeck';
import { Item } from '../../../../../types/db/item';
import MarkdownTextArea from '../../../../MarkdownTextArea/MarkdownTextArea';
import MultiSelect from '../../../../Select/MultiSelect/MultiSelect';
import NumberTextInput from '../../../NumberTextInput/NumberTextInput';
import Option from '../../../../Select/Option';
import Select from '../../../../Select/Select/Select';
import { SpellItem } from '../../../../../types/characterSheetBuilderAPI';
import SpellsSelector from '../../../../Spells/SpellsSelector/SpellsSelector';
import TextInput from '../../../../TextInput/TextInput';
import classes from './Subtrait.module.css';
import { useAppDispatch } from '../../../../../hooks/reduxHooks';

type SubtraitProps = {
	onRemove: () => void;
	parentIndex: number;
	index: number;
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
	subtrait: TraitState;
	selectedProficienciesType: ProficiencyType | null;
	setSelectedProficienciesType: (value: ProficiencyType | null) => void;
	selectedProficiencyOptionsType: ProficiencyType | null;
	setSelectedProficiencyOptionsType: (value: ProficiencyType | null) => void;
	proficiencyTypeOptions: Option[];
	proficienciesOptions: Option[];
	proficiencyOptionsOptions: Option[];
	proficiencies: SrdProficiencyItem[];
	spells: SpellItem[];
	filterSpellsSpell: (spell: SpellItem) => boolean;
	filterSpellOptionsSpell: (spell: SpellItem) => boolean;
};

const Subtrait = ({
	onRemove,
	parentIndex,
	index,
	shouldUseReduxStore,
	clickedSubmit,
	subtrait,
	selectedProficienciesType,
	setSelectedProficienciesType,
	selectedProficiencyOptionsType,
	setSelectedProficiencyOptionsType,
	proficiencyTypeOptions,
	proficienciesOptions,
	proficiencyOptionsOptions,
	proficiencies,
	spells,
	filterSpellsSpell,
	filterSpellOptionsSpell
}: SubtraitProps) => {
	const {
		errors,
		touched,
		handleChange,
		handleBlur,
		setFieldValue,
		setFieldTouched,
		setFieldError
	} = useFormikContext<EditingRaceState>();
	const dispatch = useAppDispatch();

	const [selectedSpellsSpells, setSelectedSpellsSpells] = useState(
		subtrait.spells?.map(({ id }) => id) ?? []
	);

	const [selectedSpellOptionsSpells, setSelectedSpellOptionsSpells] = useState(
		subtrait.spellOptions?.options.map(({ id }) => id) ?? []
	);

	const baseStr = useMemo(
		() => `traits.${parentIndex}.subtraitOptions.options.${index}`,
		[parentIndex, index]
	);

	const baseTouch = useMemo(
		() =>
			clickedSubmit ||
			(touched.traits &&
				touched.traits[parentIndex] &&
				touched.traits[parentIndex].subtraitOptions &&
				(
					touched.traits[parentIndex].subtraitOptions as unknown as Required<
						FormikTouched<{
							options: TraitState[];
						}>
					>
				).options[index]),
		[parentIndex, index, touched.traits, clickedSubmit]
	);

	const baseError = useMemo(
		() =>
			errors.traits &&
			errors.traits[parentIndex] &&
			(
				errors.traits[parentIndex] as FormikErrors<{
					subtraitOptions: { options: TraitState[] };
				}>
			).subtraitOptions &&
			(
				errors.traits[parentIndex] as FormikErrors<{
					subtraitOptions: { options: TraitState[] };
				}>
			).subtraitOptions?.options
				? (
						(
							errors.traits[parentIndex] as Required<
								FormikErrors<{
									subtraitOptions: { options: TraitState[] };
								}>
							>
						).subtraitOptions.options as FormikErrors<TraitState[]>
				  )[index]
				: undefined,
		[]
	);

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		event => {
			if (shouldUseReduxStore) {
				dispatch(
					setSubtraitName({ parentIndex, index, name: event.target.value })
				);
			}

			handleBlur(event);
		},
		[dispatch, handleBlur, shouldUseReduxStore, index, parentIndex]
	);

	const handleDescriptionChange = useCallback(
		(value: string) => {
			setFieldValue(`${baseStr}.description`, value, false);
		},
		[setFieldValue, baseStr]
	);

	const handleDescriptionBlur: FocusEventHandler<HTMLTextAreaElement> =
		useCallback(
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setSubtraitDescription({
							parentIndex,
							index,
							description: event.target.value
						})
					);
				}

				handleBlur(event);
			},
			[dispatch, shouldUseReduxStore, handleBlur, index, parentIndex]
		);

	const handleCheckProficiencies = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addSubtraitProficiencies({ index, parentIndex }));
				}

				setFieldValue(`${baseStr}.proficiencies`, [], false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeSubtraitProficiencies({ index, parentIndex }));
				}

				setSelectedProficienciesType(null);

				setFieldValue(`${baseStr}.proficiencies`, undefined, false);
			}
		},
		[
			dispatch,
			shouldUseReduxStore,
			setFieldValue,
			index,
			parentIndex,
			setSelectedProficienciesType,
			baseStr
		]
	);

	const handleCheckProficiencyOptions = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addSubtraitProficiencyOptions({ index, parentIndex }));
				}

				setFieldValue(`${baseStr}.proficiencyOptions`, { options: [] }, false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeSubtraitProficiencyOptions({ index, parentIndex }));
				}

				setSelectedProficiencyOptionsType(null);

				setFieldValue(`${baseStr}.proficiencyOptions`, undefined, false);
			}
		},
		[
			shouldUseReduxStore,
			index,
			parentIndex,
			baseStr,
			setFieldValue,
			dispatch,
			setSelectedProficiencyOptionsType
		]
	);

	const handleCheckHPBonus = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addSubtraitHPBonus({ parentIndex, index }));
				}

				setFieldValue(`${baseStr}.hpBonusPerLevel`, null, false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeSubtraitHPBonus({ parentIndex, index }));
				}

				setFieldValue(`${baseStr}.hpBonusPerLevel`, undefined, false);
			}
		},
		[shouldUseReduxStore, index, dispatch, setFieldValue, baseStr, parentIndex]
	);

	const handleCheckSpells = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addSubtraitSpells({ index, parentIndex }));
				}

				setFieldValue(`${baseStr}.spells`, [], false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeSubtraitSpells({ index, parentIndex }));
				}

				setSelectedSpellsSpells([]);

				setFieldValue(`${baseStr}.spells`, undefined, false);
			}
		},
		[shouldUseReduxStore, dispatch, setFieldValue, index, parentIndex, baseStr]
	);

	const handleCheckSpellOptions = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addSubtraitSpellOptions({ index, parentIndex }));
				}

				setFieldValue(`${baseStr}.spellOptions`, { options: [] }, false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeSubtraitSpellOptions({ index, parentIndex }));
				}

				setSelectedSpellOptionsSpells([]);

				setFieldValue(`${baseStr}.spellOptions`, undefined, false);
			}
		},
		[shouldUseReduxStore, dispatch, setFieldValue, index, parentIndex, baseStr]
	);

	const handleProficienciesProficiencyTypeChange = useCallback(
		(value: number | string) => {
			const newValue = value === 'blank' ? null : (value as ProficiencyType);
			const changed = newValue !== selectedProficienciesType;
			setSelectedProficienciesType(newValue);

			if ((subtrait.proficiencies?.length ?? 0) > 0 && changed) {
				if (shouldUseReduxStore) {
					dispatch(
						setSubtraitProficiencies({
							index,
							parentIndex,
							proficiencies: []
						})
					);
				}

				setFieldValue(`${baseStr}.proficiencies`, [], false);
			}
		},
		[
			dispatch,
			setFieldValue,
			index,
			setSelectedProficienciesType,
			shouldUseReduxStore,
			subtrait.proficiencies?.length,
			selectedProficienciesType,
			baseStr,
			parentIndex
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
					setSubtraitProficiencies({
						parentIndex,
						index,
						proficiencies: newProficiencies
					})
				);
			}

			setFieldValue(`${baseStr}.proficiencies`, newProficiencies, false);
			setFieldTouched(`${baseStr}.proficiencies`, true, false);
			setFieldError(
				`${baseStr}.proficiencies`,
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
			shouldUseReduxStore,
			parentIndex,
			baseStr
		]
	);

	const handleProficiencyOptionsChooseChange: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				setFieldValue(
					`${baseStr}.proficiencyOptions.choose`,
					event.target.value,
					false
				);
			},
			[baseStr, setFieldValue]
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
					(subtrait.proficiencyOptions?.options ?? []).length > 0 &&
					newValue >= (subtrait.proficiencyOptions?.options ?? []).length
				) {
					newValue = (subtrait.proficiencyOptions?.options ?? []).length - 1;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setSubtraitProficiencyOptionsChoose({
							index,
							parentIndex,
							choose: newValue
						})
					);
				}
				setFieldValue(`${baseStr}.proficiencyOptions.choose`, newValue, false);
				setFieldTouched(`${baseStr}.proficiencyOptions.choose`, true, false);
				setFieldError(
					`${baseStr}.proficiencyOptions.choose`,
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
				subtrait.proficiencyOptions?.options,
				selectedProficiencyOptionsType,
				baseStr,
				parentIndex
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
					setSubtraitProficiencyOptionsOptions({
						parentIndex,
						index,
						options: newProficiencies
					})
				);
			}

			setFieldValue(
				`${baseStr}.proficiencyOptions.options`,
				newProficiencies,
				false
			);
			setFieldTouched(`${baseStr}.proficiencyOptions.options`, true, false);
			setFieldError(
				`${baseStr}.proficiencyOptions.options`,
				newProficiencies.length === 0
					? 'Must have at least 1 proficiency to choose from'
					: undefined
			);

			if (
				(subtrait.proficiencyOptions?.choose ?? 0) >= newProficiencies.length &&
				(subtrait.proficiencyOptions?.choose ?? 0) > 0
			) {
				const newChoose = newProficiencies.length - 1;
				if (shouldUseReduxStore) {
					dispatch(
						setSubtraitProficiencyOptionsChoose({
							parentIndex,
							index,
							choose: newChoose
						})
					);
				}
				setFieldValue(`${baseStr}.proficiencyOptions.choose`, newChoose, false);
				setFieldError(
					`${baseStr}.proficiencyOptions.choose`,
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
			subtrait.proficiencyOptions?.choose,
			baseStr,
			parentIndex
		]
	);

	const handleProficiencyOptionsTypeChange = useCallback(
		(value: number | string) => {
			const newValue = value === 'blank' ? null : (value as ProficiencyType);
			const changed = newValue !== selectedProficiencyOptionsType;
			setSelectedProficiencyOptionsType(newValue);

			if ((subtrait.proficiencyOptions?.options?.length ?? 0) > 0 && changed) {
				if (shouldUseReduxStore) {
					dispatch(
						setSubtraitProficiencyOptionsOptions({
							parentIndex,
							index,
							options: []
						})
					);
				}

				setFieldValue(`${baseStr}.proficiencyOptions.options`, [], false);
			}

			if (changed) {
				if (shouldUseReduxStore) {
					dispatch(setSubtraitProficiencyOptionsChoose({ index, parentIndex }));
				}

				setFieldValue(`${baseStr}.proficiencyOptions.choose`, undefined, false);
			}
		},
		[
			dispatch,
			shouldUseReduxStore,
			index,
			setFieldValue,
			selectedProficiencyOptionsType,
			setSelectedProficiencyOptionsType,
			subtrait.proficiencyOptions?.options?.length,
			baseStr,
			parentIndex
		]
	);

	const handleHPBonusChange: ChangeEventHandler<HTMLInputElement> = useCallback(
		event => {
			setFieldValue(`${baseStr}.hpBonusPerLevel`, event.target.value, false);
		},
		[setFieldValue, baseStr]
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
					setSubtraitHPBonus({
						parentIndex,
						index,
						hpBonus: newValue
					})
				);
			}

			setFieldValue(`${baseStr}.hpBonusPerLevel`, newValue, false);
			setFieldTouched(`${baseStr}.hpBonusPerLevel`, true, false);
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldTouched,
			setFieldValue,
			baseStr,
			parentIndex,
			index
		]
	);

	const handleSpellsAdd = useCallback(
		(spell: SpellItem) => {
			const newSpells = [
				...(subtrait.spells ?? []),
				{ id: spell.id, name: spell.name }
			];

			if (shouldUseReduxStore) {
				dispatch(setSubtraitSpells({ parentIndex, index, spells: newSpells }));
			}

			setSelectedSpellsSpells(prev => [...prev, spell.id]);

			setFieldValue(`${baseStr}.spells`, newSpells, false);
		},
		[
			index,
			dispatch,
			setFieldValue,
			shouldUseReduxStore,
			subtrait.spells,
			parentIndex,
			baseStr
		]
	);

	const handleSpellsRemove = useCallback(
		(spell: SpellItem) => {
			const newSpells = [...(subtrait.spells ?? [])].filter(
				s => s.id !== spell.id
			);

			if (shouldUseReduxStore) {
				dispatch(setSubtraitSpells({ parentIndex, index, spells: newSpells }));
			}

			setSelectedSpellsSpells(prev => prev.filter(s => s !== spell.id));

			setFieldValue(`${baseStr}.spells`, newSpells, false);
		},
		[
			index,
			dispatch,
			setFieldValue,
			shouldUseReduxStore,
			subtrait.spells,
			baseStr,
			parentIndex
		]
	);

	const handleSpellOptionsChooseChange: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				setFieldValue(
					`${baseStr}.spellOptions.choose`,
					event.target.value,
					false
				);
			},
			[baseStr, setFieldValue]
		);

	const handleSpellOptionsChooseBlur: FocusEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				const parsedValue = parseInt(event.target.value);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue && newValue < 1) {
					newValue = 1;
				}

				const maxSize = (subtrait.spellOptions?.options ?? []).length;

				if (newValue && newValue > maxSize) {
					newValue = maxSize;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setSubtraitSpellOptionsChoose({
							parentIndex,
							index,
							choose: newValue
						})
					);
				}
				setFieldValue(`${baseStr}.spellOptions.choose`, newValue, false);
				setFieldTouched(`${baseStr}.spellOptions.choose`, true, false);
				setFieldError(
					`${baseStr}.spellOptions.choose`,
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
				subtrait.spellOptions?.options,
				parentIndex,
				baseStr
			]
		);

	const handleSpellOptionsAdd = useCallback(
		(spell: SpellItem) => {
			const newSpells = [
				...(subtrait.spellOptions?.options ?? []),
				{ id: spell.id, name: spell.name }
			];

			if (shouldUseReduxStore) {
				dispatch(
					setSubtraitSpellOptionsOptions({
						parentIndex,
						index,
						options: newSpells
					})
				);
			}

			setSelectedSpellOptionsSpells(prev => [...prev, spell.id]);

			setFieldValue(`${baseStr}.spellOptions.options`, newSpells, false);
		},
		[
			index,
			dispatch,
			setFieldValue,
			shouldUseReduxStore,
			subtrait.spellOptions?.options,
			parentIndex,
			baseStr
		]
	);

	const handleSpellOptionsRemove = useCallback(
		(spell: SpellItem) => {
			const newSpells = [...(subtrait.spellOptions?.options ?? [])].filter(
				s => s.id !== spell.id
			);

			if (shouldUseReduxStore) {
				dispatch(
					setSubtraitSpellOptionsOptions({
						parentIndex,
						index,
						options: newSpells
					})
				);
			}

			setSelectedSpellOptionsSpells(prev => prev.filter(s => s !== spell.id));

			setFieldValue(`${baseStr}.spellOptions.options`, newSpells, false);

			if ((subtrait.spellOptions?.choose ?? 0) > newSpells.length) {
				if (shouldUseReduxStore) {
					dispatch(
						setSubtraitSpellOptionsChoose({
							parentIndex,
							index,
							choose: newSpells.length
						})
					);
				}

				setFieldValue(
					`${baseStr}.spellOptions.choose`,
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
			subtrait.spellOptions?.options,
			subtrait.spellOptions?.choose,
			parentIndex,
			baseStr
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
				id={`${baseStr}.name`}
				onChange={handleChange}
				onBlur={handleNameBlur}
				value={subtrait.name ?? ''}
				touched={
					baseTouch &&
					(typeof baseTouch === 'boolean' ? baseTouch : baseTouch.name)
				}
				error={baseError?.name}
			/>
			<div style={{ alignSelf: 'stretch', marginTop: '1.5rem' }}>
				<MarkdownTextArea
					id={`traits.${index}.description`}
					label="Description"
					touched={
						baseTouch &&
						(typeof baseTouch === 'boolean' ? baseTouch : baseTouch.description)
					}
					error={baseError?.description}
					value={subtrait.description}
					onChange={handleDescriptionChange}
					onBlur={handleDescriptionBlur}
				/>
				<CheckboxDeck
					trait={subtrait}
					onHPBonusCheck={handleCheckHPBonus}
					onProficienciesCheck={handleCheckProficiencies}
					onProficiencyOptionsCheck={handleCheckProficiencyOptions}
					onSpellOptionsCheck={handleCheckSpellOptions}
					onSpellsCheck={handleCheckSpells}
				/>
				{subtrait.proficiencies && (
					<div className={classes['extra-deck']}>
						<Select
							options={proficiencyTypeOptions}
							label="Proficiency type"
							id={`${baseStr}.proficiencyType`}
							touched={
								baseTouch &&
								(typeof baseTouch === 'boolean'
									? baseTouch
									: baseTouch.proficiencies)
							}
							error={baseError?.proficiencies}
							value={selectedProficienciesType ?? 'blank'}
							onChange={handleProficienciesProficiencyTypeChange}
						/>
						{subtrait.proficiencies && subtrait.proficiencies.length > 0 && (
							<p style={{ maxWidth: '30rem' }}>
								{subtrait.proficiencies
									.map(({ name }) => name.replace(/Skill: /g, ''))
									.join(', ')}
							</p>
						)}
						{selectedProficienciesType && (
							<MultiSelect
								options={proficienciesOptions}
								values={(subtrait.proficiencies ?? []).map(({ id }) => id)}
								label="Proficiencies"
								id={`${baseStr}.proficiencies`}
								touched={
									baseTouch &&
									(typeof baseTouch === 'boolean'
										? baseTouch
										: baseTouch.proficiencies)
								}
								error={baseError?.proficiencies}
								onSelect={handleProficienciesSelect}
							/>
						)}
					</div>
				)}
				{subtrait.proficiencyOptions && (
					<div className={classes['extra-deck']}>
						<NumberTextInput
							id={`${baseStr}.proficiencyOptions.choose`}
							label="Number of proficiency options"
							value={subtrait.proficiencyOptions.choose}
							touched={
								baseTouch &&
								(typeof baseTouch === 'boolean'
									? baseTouch
									: (
											baseTouch?.proficiencyOptions as
												| FormikTouched<{
														choose: number;
												  }>
												| undefined
									  )?.choose)
							}
							error={
								(
									baseError?.proficiencyOptions as
										| FormikErrors<{
												choose?: number;
										  }>
										| undefined
								)?.choose
							}
							onChange={handleProficiencyOptionsChooseChange}
							onBlur={handleProficiencyOptionsChooseBlur}
						/>
						<Select
							options={proficiencyTypeOptions}
							label="Proficiency type"
							id={`${baseStr}.proficiencyOptions.proficiencyType`}
							value={selectedProficiencyOptionsType ?? 'blank'}
							touched={
								baseTouch &&
								(typeof baseTouch === 'boolean'
									? baseTouch
									: (
											baseTouch?.proficiencyOptions as
												| FormikTouched<{
														options?: number;
												  }>
												| undefined
									  )?.options)
							}
							error={
								baseError?.proficiencyOptions && !selectedProficiencyOptionsType
									? (
											baseError.proficiencyOptions as FormikErrors<{
												options?: Item[];
											}>
									  )?.options
									: undefined
							}
							onChange={handleProficiencyOptionsTypeChange}
						/>
						{subtrait.proficiencyOptions &&
							subtrait.proficiencyOptions.options.length > 0 && (
								<p style={{ maxWidth: '10rem' }}>
									{subtrait.proficiencyOptions.options
										.map(({ name }) => name.replace(/Skill: /g, ''))
										.join(', ')}
								</p>
							)}
						{selectedProficiencyOptionsType && (
							<MultiSelect
								options={proficiencyOptionsOptions}
								values={(subtrait.proficiencyOptions.options ?? []).map(
									({ id }) => id
								)}
								label="Proficiency Options"
								id={`traits.${index}.proficiencyOptions.options`}
								touched={
									baseTouch &&
									(typeof baseTouch === 'boolean'
										? baseTouch
										: (
												baseTouch?.proficiencyOptions as
													| FormikTouched<{
															options?: number;
													  }>
													| undefined
										  )?.options)
								}
								error={
									(
										baseError?.proficiencyOptions as
											| FormikErrors<{ options?: Item[] }>
											| undefined
									)?.options
								}
								onSelect={handleProficiencyOptionsSelect}
							/>
						)}
					</div>
				)}
				{subtrait.hpBonusPerLevel !== undefined && (
					<div className={classes['extra-deck']}>
						<NumberTextInput
							id={`${baseStr}.hpBonusPerLevel`}
							label="HP Bonus per Level"
							value={subtrait.hpBonusPerLevel}
							touched={
								baseTouch &&
								(typeof baseTouch === 'boolean'
									? baseTouch
									: baseTouch.hpBonusPerLevel)
							}
							error={baseError?.hpBonusPerLevel}
							onChange={handleHPBonusChange}
							onBlur={handleHPBonusBlur}
						/>
					</div>
				)}
				{subtrait.spells && (
					<div className={classes['extra-deck']}>
						{subtrait.spells && subtrait.spells.length > 0 && (
							<p style={{ maxWidth: '30rem' }}>
								{subtrait.spells.map(({ name }) => name).join(', ')}
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
				{subtrait.spellOptions && (
					<div
						className={classes['extra-deck']}
						style={{
							flexWrap: 'nowrap',
							flexDirection: 'column',
							alignItems: 'center'
						}}
					>
						<NumberTextInput
							id={`${baseStr}.spellOptions.choose`}
							label="Number of Spells to Choose From"
							value={subtrait.spellOptions.choose}
							touched={
								baseTouch &&
								(typeof baseTouch === 'boolean'
									? baseTouch
									: (
											baseTouch?.spellOptions as
												| FormikTouched<{ choose: number }>
												| undefined
									  )?.choose)
							}
							error={
								(
									baseError?.spellOptions as
										| FormikErrors<{ choose: number }>
										| undefined
								)?.choose
							}
							onChange={handleSpellOptionsChooseChange}
							onBlur={handleSpellOptionsChooseBlur}
						/>
						{subtrait.spellOptions.options &&
							subtrait.spellOptions.options.length > 0 && (
								<p style={{ maxWidth: '30rem' }}>
									{subtrait.spellOptions.options
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

export default Subtrait;
