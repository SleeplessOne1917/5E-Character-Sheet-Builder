'use client';

import {
	setAtHigherLevels,
	setDescription
} from '../../../../redux/features/editingSpell';

import MarkdownTextArea from '../../../MarkdownTextArea/MarkdownTextArea';
import { Spell } from '../../../../types/characterSheetBuilderAPI';
import classes from './DescriptionHigherLevels.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useCallback } from 'react';
import { useFormikContext } from 'formik';

type DescriptionHigherLevelsProps = {
	shouldUseReduxStore: boolean;
};

const DescriptionHigherLevels = ({
	shouldUseReduxStore
}: DescriptionHigherLevelsProps) => {
	const { values, errors, touched, setFieldValue, handleBlur } =
		useFormikContext<Pick<Spell, 'description' | 'atHigherLevels'>>();
	const dispatch = useAppDispatch();

	const handleDescriptionChange = useCallback(
		(description: string) => {
			setFieldValue('description', description);

			if (shouldUseReduxStore) {
				dispatch(setDescription(description));
			}
		},
		[dispatch, shouldUseReduxStore, setFieldValue]
	);

	const handleHigherLevelsChange = useCallback(
		(description: string) => {
			setFieldValue('atHigherLevels', description);
			if (shouldUseReduxStore) {
				dispatch(setAtHigherLevels(description));
			}
		},
		[dispatch, shouldUseReduxStore, setFieldValue]
	);

	return (
		<div className={classes['description-higher-levels']}>
			<MarkdownTextArea
				id="description"
				value={values.description}
				label="Description"
				onBlur={handleBlur}
				onChange={handleDescriptionChange}
				touched={touched.description}
				error={errors.description}
			/>
			<MarkdownTextArea
				id="atHigherLevels"
				value={values.atHigherLevels}
				label="At Higher Levels"
				onBlur={handleBlur}
				onChange={handleHigherLevelsChange}
				touched={touched.atHigherLevels}
				error={errors.atHigherLevels}
			/>
		</div>
	);
};

export default DescriptionHigherLevels;
