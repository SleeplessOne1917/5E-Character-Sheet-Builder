import {
	CSSProperties,
	ChangeEventHandler,
	FocusEventHandler,
	useCallback,
	useMemo,
	useState
} from 'react';
import {
	EditingRaceState,
	TraitWithSubtraitsState
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
import Subtrait from '../Subtrait/Subtrait';
import TextInput from '../../../../TextInput/TextInput';
import classes from './BaseTrait.module.css';
import { getProficiencyTypeName } from '../../../../../services/proficiencyTypeService';
import { useAppDispatch } from '../../../../../hooks/reduxHooks';

type ActionReturnType = {
	payload: { index?: number; parentIndex?: number } | number;
	type: string;
};

export type ReduxActions = {
	setName: (name: string) => ActionReturnType;
	setDescription: (description: string) => ActionReturnType;
	addProficiencies: () => ActionReturnType;
	removeProficiencies: () => ActionReturnType;
	addProficiencyOptions: () => ActionReturnType;
	removeProficiencyOptions: () => ActionReturnType;
	addHPBonus: () => ActionReturnType;
	removeHPBonus: () => ActionReturnType;
	addSpells: () => ActionReturnType;
	removeSpells: () => ActionReturnType;
	addSpellOptions: () => ActionReturnType;
	removeSpellOptions: () => ActionReturnType;
	setProficiencies: (proficiencies: Item[]) => ActionReturnType;
	setProficiencyOptionsChoose: (choose?: number) => ActionReturnType;
	setProficiencyOptionsOptions: (options: Item[]) => ActionReturnType;
	setHPBonus: (bonus: number | null) => ActionReturnType;
	setSpells: (spells: Item[]) => ActionReturnType;
	setSpellOptionsChoose: (choose?: number) => ActionReturnType;
	setSpellOptionsOptions: (options: Item[]) => ActionReturnType;
};

export type SubtraitReduxActions = {
	addSubtraits: () => ActionReturnType;
	removeSubtraits: () => ActionReturnType;
	setChoose: (choose?: number) => ActionReturnType;
	addSubtrait: () => ActionReturnType;
	removeSubtrait: (index: number) => ActionReturnType;
};

type BaseTraitProps = {
	onRemove: () => void;
	shouldUseReduxStore: boolean;
	trait: TraitWithSubtraitsState;
	style?: CSSProperties;
	selectedProficienciesType: ProficiencyType | null;
	setSelectedProficienciesType: (value: ProficiencyType | null) => void;
	selectedProficiencyOptionsType: ProficiencyType | null;
	setSelectedProficiencyOptionsType: (value: ProficiencyType | null) => void;
	proficiencies: SrdProficiencyItem[];
	spells: SpellItem[];
	baseStr: string;
	baseTouch: boolean | FormikTouched<TraitWithSubtraitsState> | undefined;
	baseError: FormikErrors<TraitWithSubtraitsState> | undefined;
	reduxActions: ReduxActions;
	subtraitReduxActions?: SubtraitReduxActions;
	clickedSubmit: boolean;
	index: number;
};

const BaseTrait = ({
	onRemove,
	shouldUseReduxStore,
	trait,
	style,
	selectedProficienciesType,
	setSelectedProficienciesType,
	selectedProficiencyOptionsType,
	setSelectedProficiencyOptionsType,
	proficiencies,
	spells,
	baseStr,
	baseTouch,
	baseError,
	reduxActions: {
		setName,
		setDescription,
		addProficiencies,
		removeProficiencies,
		addProficiencyOptions,
		removeProficiencyOptions,
		addHPBonus,
		removeHPBonus,
		addSpells,
		removeSpells,
		addSpellOptions,
		removeSpellOptions,
		setProficiencies,
		setProficiencyOptionsChoose,
		setProficiencyOptionsOptions,
		setHPBonus,
		setSpells,
		setSpellOptionsChoose,
		setSpellOptionsOptions
	},
	subtraitReduxActions,
	clickedSubmit,
	index
}: BaseTraitProps) => {
	const {
		handleChange,
		handleBlur,
		setFieldValue,
		setFieldTouched,
		setFieldError,
		values
	} = useFormikContext<EditingRaceState>();
	const dispatch = useAppDispatch();

	const [
		subtraitProficienciesSelectedTypes,
		setSubtraitProficienciesSelectedTypes
	] = useState(
		trait.subtraitOptions?.options.map(subtrait =>
			subtrait.proficiencies && subtrait.proficiencies.length > 0
				? proficiencies.find(
						prof => prof.index === (subtrait.proficiencies as Item[])[0].id
				  )?.type ?? null
				: null
		)
	);
	const [
		subtraitProficiencyOptionsSelectedTypes,
		setSubtraitProficiencyOptionsSelectedTypes
	] = useState(
		trait.subtraitOptions?.options.map(subtrait =>
			subtrait.proficiencyOptions &&
			subtrait.proficiencyOptions.options.length > 0
				? proficiencies.find(
						prof =>
							prof.index ===
							(subtrait.proficiencyOptions?.options as Item[])[0].id
				  )?.type ?? null
				: null
		)
	);

	const handleSetSubtraitProficienciesSelectedType = useCallback(
		(value: ProficiencyType | null, index: number) => {
			setSubtraitProficienciesSelectedTypes(prev =>
				(prev ?? []).map((v, i) => (i === index ? value : v))
			);
		},
		[]
	);

	const handleSetSubtraitProficiencyOptionsSelectedTypes = useCallback(
		(value: ProficiencyType | null, index: number) => {
			setSubtraitProficiencyOptionsSelectedTypes(prev =>
				(prev ?? []).map((v, i) => (i === index ? value : v))
			);
		},
		[]
	);

	const [selectedSpellsSpells, setSelectedSpellsSpells] = useState(
		trait.spells?.map(({ id }) => id) ?? []
	);

	const [selectedSpellOptionsSpells, setSelectedSpellOptionsSpells] = useState(
		trait.spellOptions?.options.map(({ id }) => id) ?? []
	);

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		event => {
			if (shouldUseReduxStore) {
				dispatch(setName(event.target.value));
			}

			handleBlur(event);
		},
		[dispatch, handleBlur, shouldUseReduxStore, setName]
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
					dispatch(setDescription(event.target.value));
				}

				handleBlur(event);
			},
			[dispatch, shouldUseReduxStore, handleBlur, setDescription]
		);

	const handleCheckProficiencies = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addProficiencies());
				}

				setFieldValue(`${baseStr}.proficiencies`, [], false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeProficiencies());
				}

				setSelectedProficienciesType(null);

				setFieldValue(`${baseStr}.proficiencies`, undefined, false);
			}
		},
		[
			dispatch,
			shouldUseReduxStore,
			setFieldValue,
			addProficiencies,
			removeProficiencies,
			setSelectedProficienciesType,
			baseStr
		]
	);

	const handleCheckProficiencyOptions = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addProficiencyOptions());
				}

				setFieldValue(`${baseStr}.proficiencyOptions`, { options: [] }, false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeProficiencyOptions());
				}

				setSelectedProficiencyOptionsType(null);

				setFieldValue(`${baseStr}.proficiencyOptions`, undefined, false);
			}
		},
		[
			shouldUseReduxStore,
			addProficiencyOptions,
			removeProficiencyOptions,
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
					dispatch(addHPBonus());
				}

				setFieldValue(`${baseStr}.hpBonusPerLevel`, null, false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeHPBonus());
				}

				setFieldValue(`${baseStr}.hpBonusPerLevel`, undefined, false);
			}
		},
		[
			shouldUseReduxStore,
			baseStr,
			dispatch,
			setFieldValue,
			addHPBonus,
			removeHPBonus
		]
	);

	const handleCheckSpells = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addSpells());
				}

				setFieldValue(`${baseStr}.spells`, [], false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeSpells());
				}

				setSelectedSpellsSpells([]);

				setFieldValue(`${baseStr}.spells`, undefined, false);
			}
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			addSpells,
			removeSpells,
			baseStr
		]
	);

	const handleCheckSpellOptions = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addSpellOptions());
				}

				setFieldValue(`${baseStr}.spellOptions`, { options: [] }, false);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeSpellOptions());
				}

				setSelectedSpellOptionsSpells([]);

				setFieldValue(`${baseStr}.spellOptions`, undefined, false);
			}
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			addSpellOptions,
			removeSpellOptions,
			baseStr
		]
	);

	const handleCheckSubtraits = useCallback(
		(value: boolean) => {
			if (value) {
				if (shouldUseReduxStore && subtraitReduxActions) {
					dispatch(subtraitReduxActions.addSubtraits());
				}

				setFieldValue(`${baseStr}.subtraitOptions`, { options: [] }, false);
			} else {
				if (shouldUseReduxStore && subtraitReduxActions) {
					dispatch(subtraitReduxActions.removeSubtraits());
				}

				setFieldValue(`${baseStr}.subtraitOptions`, undefined, false);
			}
		},
		[
			shouldUseReduxStore,
			setFieldValue,
			dispatch,
			baseStr,
			subtraitReduxActions
		]
	);

	const handleProficienciesProficiencyTypeChange = useCallback(
		(value: number | string) => {
			const newValue = value === 'blank' ? null : (value as ProficiencyType);
			const changed = newValue !== selectedProficienciesType;
			setSelectedProficienciesType(newValue);

			if ((trait.proficiencies?.length ?? 0) > 0 && changed) {
				if (shouldUseReduxStore) {
					dispatch(setProficiencies([]));
				}

				setFieldValue(`${baseStr}.proficiencies`, [], false);
			}
		},
		[
			dispatch,
			setFieldValue,
			setSelectedProficienciesType,
			shouldUseReduxStore,
			trait.proficiencies?.length,
			selectedProficienciesType,
			baseStr,
			setProficiencies
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
				dispatch(setProficiencies(newProficiencies));
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
			proficiencies,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			shouldUseReduxStore,
			baseStr,
			setProficiencies
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
					(trait.proficiencyOptions?.options ?? []).length > 0 &&
					newValue >= (trait.proficiencyOptions?.options ?? []).length
				) {
					newValue = (trait.proficiencyOptions?.options ?? []).length - 1;
				}

				if (shouldUseReduxStore) {
					dispatch(setProficiencyOptionsChoose(newValue));
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
				setFieldValue,
				setFieldError,
				setFieldTouched,
				shouldUseReduxStore,
				trait.proficiencyOptions?.options,
				selectedProficiencyOptionsType,
				baseStr,
				setProficiencyOptionsChoose
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
				dispatch(setProficiencyOptionsOptions(newProficiencies));
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
				(trait.proficiencyOptions?.choose ?? 0) >= newProficiencies.length &&
				(trait.proficiencyOptions?.choose ?? 0) > 0
			) {
				const newChoose = newProficiencies.length - 1;
				if (shouldUseReduxStore) {
					dispatch(setProficiencyOptionsChoose(newChoose));
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
			setFieldError,
			setFieldValue,
			setFieldTouched,
			proficiencies,
			shouldUseReduxStore,
			trait.proficiencyOptions?.choose,
			baseStr,
			setProficiencyOptionsOptions,
			setProficiencyOptionsChoose
		]
	);

	const handleProficiencyOptionsTypeChange = useCallback(
		(value: number | string) => {
			const newValue = value === 'blank' ? null : (value as ProficiencyType);
			const changed = newValue !== selectedProficiencyOptionsType;
			setSelectedProficiencyOptionsType(newValue);

			if ((trait.proficiencyOptions?.options?.length ?? 0) > 0 && changed) {
				if (shouldUseReduxStore) {
					dispatch(setProficiencyOptionsOptions([]));
				}

				setFieldValue(`${baseStr}.proficiencyOptions.options`, [], false);
			}

			if (changed) {
				if (shouldUseReduxStore) {
					dispatch(setProficiencyOptionsChoose());
				}

				setFieldValue(`${baseStr}.proficiencyOptions.choose`, undefined, false);
			}
		},
		[
			dispatch,
			shouldUseReduxStore,
			setFieldValue,
			selectedProficiencyOptionsType,
			setSelectedProficiencyOptionsType,
			trait.proficiencyOptions?.options?.length,
			baseStr,
			setProficiencyOptionsOptions,
			setProficiencyOptionsChoose
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
				dispatch(setHPBonus(newValue));
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
			setHPBonus
		]
	);

	const handleSpellsAdd = useCallback(
		(spell: SpellItem) => {
			const newSpells = [
				...(trait.spells ?? []),
				{ id: spell.id, name: spell.name }
			];

			if (shouldUseReduxStore) {
				dispatch(setSpells(newSpells));
			}

			setSelectedSpellsSpells(prev => [...prev, spell.id]);

			setFieldValue(`${baseStr}.spells`, newSpells, false);
		},
		[
			dispatch,
			setFieldValue,
			shouldUseReduxStore,
			trait.spells,
			baseStr,
			setSpells
		]
	);

	const handleSpellsRemove = useCallback(
		(spell: SpellItem) => {
			const newSpells = [...(trait.spells ?? [])].filter(
				s => s.id !== spell.id
			);

			if (shouldUseReduxStore) {
				dispatch(setSpells(newSpells));
			}

			setSelectedSpellsSpells(prev => prev.filter(s => s !== spell.id));

			setFieldValue(`${baseStr}.spells`, newSpells, false);
		},
		[
			dispatch,
			setFieldValue,
			shouldUseReduxStore,
			trait.spells,
			baseStr,
			setSpells
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

				const maxSize = (trait.spellOptions?.options ?? []).length;

				if (newValue && newValue > maxSize) {
					newValue = maxSize;
				}

				if (shouldUseReduxStore) {
					dispatch(setSpellOptionsChoose(newValue));
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
				shouldUseReduxStore,
				setFieldError,
				setFieldTouched,
				setFieldValue,
				trait.spellOptions?.options,
				baseStr,
				setSpellOptionsChoose
			]
		);

	const handleSpellOptionsAdd = useCallback(
		(spell: SpellItem) => {
			const newSpells = [
				...(trait.spellOptions?.options ?? []),
				{ id: spell.id, name: spell.name }
			];

			if (shouldUseReduxStore) {
				dispatch(setSpellOptionsOptions(newSpells));
			}

			setSelectedSpellOptionsSpells(prev => [...prev, spell.id]);

			setFieldValue(`${baseStr}.spellOptions.options`, newSpells, false);
		},
		[
			dispatch,
			setFieldValue,
			shouldUseReduxStore,
			trait.spellOptions?.options,
			baseStr,
			setSpellOptionsOptions
		]
	);

	const handleSpellOptionsRemove = useCallback(
		(spell: SpellItem) => {
			const newSpells = [...(trait.spellOptions?.options ?? [])].filter(
				s => s.id !== spell.id
			);

			if (shouldUseReduxStore) {
				dispatch(setSpellOptionsOptions(newSpells));
			}

			setSelectedSpellOptionsSpells(prev => prev.filter(s => s !== spell.id));

			setFieldValue(`${baseStr}.spellOptions.options`, newSpells, false);

			if ((trait.spellOptions?.choose ?? 0) > newSpells.length) {
				if (shouldUseReduxStore) {
					dispatch(setSpellOptionsChoose(newSpells.length));
				}

				setFieldValue(
					`${baseStr}.spellOptions.choose`,
					newSpells.length,
					false
				);
			}
		},
		[
			dispatch,
			setFieldValue,
			shouldUseReduxStore,
			trait.spellOptions?.options,
			trait.spellOptions?.choose,
			baseStr,
			setSpellOptionsOptions,
			setSpellOptionsChoose
		]
	);

	const handleSubtraitOptionsChooseChange: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				setFieldValue(
					`${baseStr}.subtraitOptions.choose`,
					event.target.value,
					false
				);
			},
			[baseStr, setFieldValue]
		);

	const handleSubtraitOptionsChooseBlur: FocusEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				const parsedValue = parseInt(event.target.value);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue && newValue < 1) {
					newValue = 1;
				}

				const maxSize = (trait.subtraitOptions?.options ?? []).length;

				if (newValue && newValue > maxSize) {
					newValue = maxSize;
				}

				if (shouldUseReduxStore && subtraitReduxActions) {
					dispatch(subtraitReduxActions.setChoose(newValue));
				}
				setFieldValue(`${baseStr}.subtraitOptions.choose`, newValue, false);
				setFieldTouched(`${baseStr}.subtraitOptions.choose`, true, false);
				setFieldError(
					`${baseStr}.subtraitOptions.choose`,
					!newValue ? 'Must choose at least 1 subtrait' : undefined
				);
			},
			[
				dispatch,
				shouldUseReduxStore,
				setFieldError,
				setFieldTouched,
				setFieldValue,
				subtraitReduxActions,
				trait.subtraitOptions?.options,
				baseStr
			]
		);

	const handleAddSubtrait = useCallback(() => {
		if (shouldUseReduxStore && subtraitReduxActions) {
			dispatch(subtraitReduxActions.addSubtrait());
		}

		setSubtraitProficienciesSelectedTypes(prev => [...(prev ?? []), null]);
		setSubtraitProficiencyOptionsSelectedTypes(prev => [...(prev ?? []), null]);

		setFieldValue(
			`${baseStr}.subtraitOptions.options`,
			[...(trait.subtraitOptions?.options ?? []), {}],
			false
		);
	}, [
		dispatch,
		shouldUseReduxStore,
		setFieldValue,
		trait.subtraitOptions?.options,
		baseStr,
		subtraitReduxActions
	]);

	const handleRemoveSubtrait = useCallback(
		(subtraitIndex: number) => {
			if (shouldUseReduxStore && subtraitReduxActions) {
				dispatch(subtraitReduxActions.removeSubtrait(subtraitIndex));
			}

			setSubtraitProficienciesSelectedTypes(prev =>
				(prev ?? []).filter((v, i) => i !== subtraitIndex)
			);

			setSubtraitProficiencyOptionsSelectedTypes(prev =>
				(prev ?? []).filter((v, i) => i !== subtraitIndex)
			);

			setFieldValue(
				`${baseStr}.subtraitOptions.options`,
				trait.subtraitOptions?.options.filter((v, i) => i !== subtraitIndex),
				false
			);
		},
		[
			dispatch,
			shouldUseReduxStore,
			subtraitReduxActions,
			setFieldValue,
			baseStr,
			trait.subtraitOptions?.options
		]
	);

	const levels = [...new Array(10).keys()];

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

	const getSelectedSpells = useCallback(
		() =>
			values.traits
				.flatMap(t => t.spells ?? [])
				.concat(values.traits.flatMap(t => t.spellOptions?.options ?? []))
				.concat(
					values.traits.flatMap(t =>
						(t.subtraitOptions?.options ?? []).flatMap(o => o.spells ?? [])
					)
				)
				.concat(
					values.traits.flatMap(t =>
						(t.subtraitOptions?.options ?? []).flatMap(
							o => o.spellOptions?.options ?? []
						)
					)
				),
		[values.traits]
	);

	const filterSpellsSpell = useCallback(
		(spell: SpellItem) =>
			!(
				getSelectedSpells().some(t => t.id === spell.id) &&
				!selectedSpellsSpells?.some(s => s === spell.id)
			),
		[getSelectedSpells, selectedSpellsSpells]
	);

	const filterSpellOptionsSpell = useCallback(
		(spell: SpellItem) =>
			!(
				getSelectedSpells().some(t => t.id === spell.id) &&
				!selectedSpellOptionsSpells?.some(s => s === spell.id)
			),
		[getSelectedSpells, selectedSpellOptionsSpells]
	);

	const getProficienciesFromTraits = useCallback(
		() =>
			values.traits
				.flatMap(t => t.proficiencies ?? [])
				.concat(values.traits.flatMap(t => t.proficiencyOptions?.options ?? []))
				.concat(
					values.traits.flatMap(t =>
						(t.subtraitOptions?.options ?? []).flatMap(
							o => o.proficiencies ?? []
						)
					)
				)
				.concat(
					values.traits.flatMap(t =>
						(t.subtraitOptions?.options ?? []).flatMap(
							o => o.proficiencyOptions?.options ?? []
						)
					)
				),
		[values.traits]
	);

	const proficienciesOptions = useMemo(
		() =>
			proficiencies
				.filter(
					prof =>
						prof.type === selectedProficienciesType &&
						!(
							getProficienciesFromTraits().some(tp => tp.id === prof.index) &&
							!(trait.proficiencies ?? []).some(tp => tp.id === prof.index)
						)
				)
				.map(
					prof =>
						({
							label: prof.name.replace(/Skill: /g, ''),
							value: prof.index
						} as Option)
				),
		[
			proficiencies,
			selectedProficienciesType,
			trait.proficiencies,
			getProficienciesFromTraits
		]
	);

	const proficiencyOptionsOptions = useMemo(
		() =>
			proficiencies
				.filter(
					prof =>
						prof.type === selectedProficiencyOptionsType &&
						!(
							getProficienciesFromTraits().some(tp => tp.id === prof.index) &&
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
			getProficienciesFromTraits
		]
	);

	return (
		<div className={classes.trait} style={style}>
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
				value={trait.name ?? ''}
				touched={
					baseTouch &&
					(typeof baseTouch === 'boolean' ? baseTouch : baseTouch.name)
				}
				error={baseError?.name}
			/>
			<div style={{ alignSelf: 'stretch', marginTop: '1.5rem' }}>
				<MarkdownTextArea
					id={`${baseStr}.description`}
					label="Description"
					touched={
						baseTouch &&
						(typeof baseTouch === 'boolean' ? baseTouch : baseTouch.description)
					}
					error={baseError?.description}
					value={trait.description}
					onChange={handleDescriptionChange}
					onBlur={handleDescriptionBlur}
				/>
				<CheckboxDeck
					trait={trait}
					onHPBonusCheck={handleCheckHPBonus}
					onProficienciesCheck={handleCheckProficiencies}
					onProficiencyOptionsCheck={handleCheckProficiencyOptions}
					onSpellOptionsCheck={handleCheckSpellOptions}
					onSpellsCheck={handleCheckSpells}
					onSubtraitsCheck={
						subtraitReduxActions ? handleCheckSubtraits : undefined
					}
				/>
				{trait.proficiencies && (
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
				{trait.proficiencyOptions && (
					<div className={classes['extra-deck']}>
						<NumberTextInput
							id={`${baseStr}.proficiencyOptions.choose`}
							label="Number of proficiency options"
							value={trait.proficiencyOptions.choose}
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
								id={`${baseStr}.proficiencyOptions.options`}
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
				{trait.hpBonusPerLevel !== undefined && (
					<div className={classes['extra-deck']}>
						<NumberTextInput
							id={`${baseStr}.hpBonusPerLevel`}
							label="HP Bonus per Level"
							value={trait.hpBonusPerLevel}
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
							id={`${baseStr}.spellOptions.choose`}
							label="Number of Spells to Choose From"
							value={trait.spellOptions.choose}
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
				{trait.subtraitOptions && (
					<div
						className={classes['extra-deck']}
						style={{
							flexWrap: 'nowrap',
							flexDirection: 'column',
							alignItems: 'center'
						}}
					>
						<NumberTextInput
							id={`${baseStr}.subtraitOptions.choose`}
							label="Number of Subtraits to Select"
							value={trait.subtraitOptions.choose}
							touched={
								baseTouch &&
								(typeof baseTouch === 'boolean'
									? baseTouch
									: (
											baseTouch?.subtraitOptions as
												| FormikTouched<{ choose: number }>
												| undefined
									  )?.choose)
							}
							error={
								(
									baseError?.subtraitOptions as
										| FormikErrors<{ choose: number }>
										| undefined
								)?.choose
							}
							onChange={handleSubtraitOptionsChooseChange}
							onBlur={handleSubtraitOptionsChooseBlur}
						/>
						<div className={classes['subtraits-container']}>
							{trait.subtraitOptions.options.map((subtrait, i) => (
								<Subtrait
									clickedSubmit={clickedSubmit}
									index={i}
									key={i}
									onRemove={() => handleRemoveSubtrait(i)}
									parentIndex={index}
									proficiencies={proficiencies}
									selectedProficienciesType={
										subtraitProficienciesSelectedTypes
											? subtraitProficienciesSelectedTypes[i]
											: null
									}
									selectedProficiencyOptionsType={
										subtraitProficiencyOptionsSelectedTypes
											? subtraitProficiencyOptionsSelectedTypes[i]
											: null
									}
									setSelectedProficienciesType={val =>
										handleSetSubtraitProficienciesSelectedType(val, i)
									}
									setSelectedProficiencyOptionsType={val =>
										handleSetSubtraitProficiencyOptionsSelectedTypes(val, i)
									}
									shouldUseReduxStore={shouldUseReduxStore}
									spells={spells}
									subtrait={subtrait}
								/>
							))}
							{trait.subtraitOptions.options.length < 10 && (
								<Button
									positive
									onClick={handleAddSubtrait}
									style={{ width: 'fit-content' }}
								>
									Add Subtrait
								</Button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default BaseTrait;
