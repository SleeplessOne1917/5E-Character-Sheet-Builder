'use client';

import { FormikErrors, useFormikContext } from 'formik';
import {
	setClasses,
	setDamageType
} from '../../../../redux/features/editingSpell';
import { useCallback, useMemo } from 'react';

import { Item } from '../../../../types/db/item';
import MultiSelect from '../../../Select/MultiSelect/MultiSelect';
import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import { Spell } from '../../../../types/characterSheetBuilderAPI';
import { SrdItem } from '../../../../types/srd';
import classes from './ClassesDamageType.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';

type ClassesDamageTypeProps = {
	srdClasses: SrdItem[];
	shouldUseReduxStore: boolean;
	damageTypes: SrdItem[];
};

const ClassesDamageType = ({
	shouldUseReduxStore,
	srdClasses,
	damageTypes
}: ClassesDamageTypeProps) => {
	const {
		values,
		errors,
		touched,
		setFieldError,
		setFieldTouched,
		setFieldValue
	} = useFormikContext<Pick<Spell, 'classes' | 'damageType'>>();
	const dispatch = useAppDispatch();

	const handleSelectClasses = useCallback(
		(values: (string | number)[]) => {
			const newClasses: Item[] = srdClasses
				.filter(klass => values.includes(klass.index))
				.map<Item>(klass => ({
					id: klass.index,
					name: klass.name
				}));

			if (shouldUseReduxStore) {
				dispatch(setClasses(newClasses));
			}

			setFieldValue('classes', newClasses, false);
			setFieldTouched('classes', true, false);
			setFieldError(
				'classes',
				newClasses.length === 0 ? 'Must select at least 1 class' : undefined
			);
		},
		[
			dispatch,
			srdClasses,
			shouldUseReduxStore,
			setFieldError,
			setFieldTouched,
			setFieldValue
		]
	);

	const handleDamageTypeChange = useCallback(
		(value: string | number) => {
			let newDamageType: Item | undefined = undefined;

			if (value !== 'blank') {
				const damageTypeSrd = damageTypes.find(
					dt => dt.index === (value as string)
				) as SrdItem;

				newDamageType = {
					id: damageTypeSrd.index,
					name: damageTypeSrd.name
				};
			}

			if (shouldUseReduxStore) {
				dispatch(setDamageType(newDamageType));
			}

			setFieldValue('damageType', newDamageType, false);
			setFieldTouched('damageType', true, false);
		},
		[dispatch, damageTypes, shouldUseReduxStore, setFieldTouched, setFieldValue]
	);

	const classOptions: Option[] = useMemo(
		() =>
			[...srdClasses]
				.sort((a, b) => a.name.localeCompare(b.name))
				.map(klass => ({
					value: klass.index,
					label: klass.name
				})),
		[srdClasses]
	);

	const classError = useMemo(
		() =>
			typeof errors.classes === 'string' || !errors.classes
				? errors.classes
				: typeof errors.classes[0] === 'string'
				? errors.classes[0]
				: (errors.classes as FormikErrors<Item>[])[0].name,
		[errors.classes]
	);

	const selectedClasses = useMemo(
		() => values.classes.map(({ id }) => id),
		[values.classes]
	);

	const damageTypeOptions: Option[] = useMemo(
		() =>
			[{ value: 'blank', label: '\u2014' }].concat(
				damageTypes.map(dt => ({
					value: dt.index,
					label: dt.name
				}))
			),
		[damageTypes]
	);

	return (
		<div className={classes['classes-damage-type']}>
			<div className={classes['classes-container']}>
				<MultiSelect
					id="spellcasting-classes"
					label="Spellcasting Classes"
					touched={touched.classes as boolean | undefined}
					error={classError}
					values={selectedClasses}
					options={classOptions}
					onSelect={handleSelectClasses}
				/>
			</div>
			<div className={classes['damage-type-container']}>
				<Select
					id="damage-type"
					label="Damage Type"
					touched={touched.damageType}
					error={errors.damageType}
					value={values.damageType?.id ?? 'blank'}
					options={damageTypeOptions}
					onChange={handleDamageTypeChange}
				/>
				{!!values.damageType && (
					<svg className={classes['damage-type-icon']}>
						<use xlinkHref={`/Icons.svg#${values.damageType.id}`} />
					</svg>
				)}
			</div>
		</div>
	);
};

export default ClassesDamageType;
