'use client';

import {
	EditingClassState,
	setProficiencies
} from '../../../../redux/features/editingClass';
import { ProficiencyType, SrdProficiencyItem } from '../../../../types/srd';
import { useCallback, useMemo, useState } from 'react';

import { Item } from '../../../../types/db/item';
import MultiSelect from '../../../Select/MultiSelect/MultiSelect';
import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import { getProficiencyTypeName } from '../../../../services/proficiencyTypeService';
import styles from './Proficiencies.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';

type ProficienciesProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	proficiencies: SrdProficiencyItem[];
};

type ProficiencyGroup = {
	type: ProficiencyType;
	proficiencies: SrdProficiencyItem[];
};

const Proficiencies = ({
	clickedSubmit,
	proficiencies,
	shouldUseReduxStore
}: ProficienciesProps) => {
	const {
		values,
		errors,
		touched,
		setFieldValue,
		setFieldTouched,
		setFieldError
	} = useFormikContext<EditingClassState>();
	const dispatch = useAppDispatch();
	const [selectedProficienciesType, setSelectedProficienciesType] =
		useState<string | null>(null);
	const proficienciesValues = useMemo(
		() => values.proficiencies.map(proficiency => proficiency.id),
		[values]
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

	const proficienciesError = useMemo(
		() =>
			typeof errors.proficiencies === 'string' || !errors.proficiencies
				? errors.proficiencies
				: typeof errors.proficiencies[0] === 'string'
				? errors.proficiencies[0]
				: errors.proficiencies[0].name,
		[errors]
	);

	const proficienciesOptions = useMemo(
		() =>
			proficiencies
				.filter(
					proficiency =>
						proficiency.type === selectedProficienciesType &&
						!values.proficiencyChoices
							?.flatMap(choice => choice.options)
							.some(option => option?.id === proficiency.index) &&
						!values.proficiencyChoices
							?.flatMap(choice => choice.options)
							.flatMap(option => option?.options)
							.some(option => option?.id === proficiency.index)
				)
				.map<Option>(proficiency => ({
					label: proficiency.name.replace(/Skill: /, ''),
					value: proficiency.index
				})),
		[proficiencies, selectedProficienciesType, values.proficiencyChoices]
	);

	const proficiencyGroups = useMemo(
		() =>
			values.proficiencies.reduce<ProficiencyGroup[]>((acc, cur) => {
				const proficiency = proficiencies.find(prof => prof.index === cur.id)!;

				if (
					acc.length > 0 &&
					acc.some(group => group.type === proficiency.type)
				) {
					return acc.map(group =>
						group.type === proficiency.type
							? {
									...group,
									proficiencies: [...group.proficiencies, proficiency]
							  }
							: group
					);
				} else {
					return [
						...acc,
						{
							type: proficiency.type,
							proficiencies: [proficiency]
						} as ProficiencyGroup
					];
				}
			}, []),
		[values.proficiencies, proficiencies]
	);

	const handleChangeProficienciesType = useCallback(
		(value: string | number) => {
			const newValue = value !== 'blank' ? (value as string) : null;
			setSelectedProficienciesType(newValue);
		},
		[]
	);

	const handleProficienciesChange = useCallback(
		(values: (string | number)[]) => {
			const newValues = proficiencies
				.filter(proficiency => values.includes(proficiency.index))
				.map<Item>(proficiency => ({
					id: proficiency.index,
					name: proficiency.name
				}));

			if (shouldUseReduxStore) {
				dispatch(setProficiencies(newValues));
			}

			setFieldValue('proficiencies', newValues, false);
			setFieldTouched('proficiencies', true, false);
			setFieldError(
				'proficiencies',
				newValues.length === 0 ? 'Must have at least 1 proficiency' : undefined
			);
		},
		[
			proficiencies,
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue
		]
	);
	return (
		<div
			className={`${styles.container}${
				(clickedSubmit || touched.proficiencies) && proficienciesError
					? ` ${styles.error}`
					: ''
			}`}
		>
			<h2>Proficiencies</h2>
			<div className={styles.proficiencies}>
				<Select
					id="proficiencies-type"
					label="Proficiency Type"
					value={selectedProficienciesType ?? 'blank'}
					options={proficiencyTypeOptions}
					onChange={handleChangeProficienciesType}
				/>
				{selectedProficienciesType && (
					<MultiSelect
						id="proficiencies"
						label="Proficiencies"
						values={proficienciesValues}
						error={proficienciesError}
						touched={clickedSubmit || !!touched.proficiencies}
						options={proficienciesOptions}
						onSelect={handleProficienciesChange}
					/>
				)}
				{proficiencyGroups.length > 0 && (
					<div className={styles['proficiency-groups']}>
						{proficiencyGroups.map(group => (
							<div key={group.type} className={styles['proficiency-group']}>
								<div className={styles['proficiency-group-title']}>
									{getProficiencyTypeName(group.type)}
								</div>
								<ul className={styles['proficiency-group-list']}>
									{group.proficiencies.map(prof => (
										<li key={prof.index}>{prof.name.replace(/Skill: /, '')}</li>
									))}
								</ul>
							</div>
						))}
					</div>
				)}
				{(clickedSubmit || touched.proficiencies) && proficienciesError && (
					<div className={styles['error-message']}>{proficienciesError}</div>
				)}
			</div>
		</div>
	);
};

export default Proficiencies;
