'use client';

import { ChangeEventHandler, FocusEventHandler, useCallback } from 'react';
import {
	EditingClassState,
	FeatureState,
	addFeature,
	removeFeature,
	setFeatureDescription,
	setFeatureLevel,
	setFeatureName
} from '../../../../redux/features/editingClass';
import { FormikErrors, useFormikContext } from 'formik';

import Button from '../../../Button/Button';
import MarkdownTextArea from '../../../MarkdownTextArea/MarkdownTextArea';
import NumberTextInput from '../../NumberTextInput/NumberTextInput';
import RemoveButton from '../../../RemoveButton/RemoveButton';
import TextInput from '../../../TextInput/TextInput';
import styles from './Features.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { v4 as uuidV4 } from 'uuid';

type FeaturesProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
};

const getFeatureStr = (index: number) => `features.${index}`;

const Features = ({ clickedSubmit, shouldUseReduxStore }: FeaturesProps) => {
	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		setFieldValue,
		setFieldError,
		setFieldTouched
	} = useFormikContext<EditingClassState>();
	const dispatch = useAppDispatch();

	const getFeatureTouched = useCallback(
		(index: number) => touched.features && touched.features[index],
		[touched.features]
	);

	const getFeatureError = useCallback(
		(index: number) =>
			errors.features
				? (errors.features[index] as FormikErrors<FeatureState> | undefined)
				: undefined,
		[errors.features]
	);

	const handleAddFeature = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(addFeature());
		}

		setFieldValue(
			'features',
			[...values.features, { uuid: uuidV4(), name: '', description: '' }],
			false
		);
	}, [shouldUseReduxStore, dispatch, setFieldValue, values.features]);

	const getHandleRemoveFeature = useCallback(
		(id: string) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeFeature(id));
			}

			setFieldValue(
				'features',
				values.features.filter(({ uuid }) => uuid !== id),
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getNameTouched = useCallback(
		(index: number) => getFeatureTouched(index)?.name,
		[getFeatureTouched]
	);

	const getNameError = useCallback(
		(index: number) => getFeatureError(index)?.name,
		[getFeatureError]
	);

	const getHandleNameBlur = useCallback(
		(index: number): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(setFeatureName({ index, name: event.target.value }));
				}

				handleBlur(event);
			},
		[shouldUseReduxStore, dispatch, handleBlur]
	);

	const getDescriptionTouched = useCallback(
		(index: number) => getFeatureTouched(index)?.description,
		[getFeatureTouched]
	);

	const getDescriptionError = useCallback(
		(index: number) => getFeatureError(index)?.description,
		[getFeatureError]
	);

	const getHandleDescriptionChange = useCallback(
		(index: number) => (value: string) => {
			setFieldValue(`features.${index}.description`, value, false);
		},
		[setFieldValue]
	);

	const getHandleDescriptionBlur = useCallback(
		(index: number): FocusEventHandler<HTMLTextAreaElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeatureDescription({ index, description: event.target.value })
					);
				}

				const field = `features.${index}.description`;

				setFieldValue(field, event.target.value, false);
				setFieldTouched(field, true, false);
				setFieldError(
					field,
					event.target.value.length === 0
						? 'Description is required'
						: undefined
				);
			},
		[
			setFieldValue,
			dispatch,
			shouldUseReduxStore,
			setFieldError,
			setFieldTouched
		]
	);

	const getLevelTouched = useCallback(
		(index: number) => getFeatureTouched(index)?.level,
		[getFeatureTouched]
	);

	const getLevelError = useCallback(
		(index: number) => getFeatureError(index)?.level,
		[getFeatureError]
	);

	const getHandleLevelChange = useCallback(
		(index: number): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(`features.${index}.level`, event.target.value, false);
			},
		[setFieldValue]
	);

	const getHandleLevelBlur = useCallback(
		(index: number): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue !== undefined && newValue < 1) {
					newValue = 1;
				}

				if (newValue !== undefined && newValue > 20) {
					newValue = 20;
				}

				if (shouldUseReduxStore) {
					dispatch(setFeatureLevel({ index, level: newValue }));
				}

				const field = `${getFeatureStr(index)}.level`;
				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newValue ? 'Level is required' : undefined);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldValue,
			setFieldTouched
		]
	);

	return (
		<section className={styles.container}>
			<h2>Features</h2>
			{values.features.length > 0 && (
				<div className={styles.features}>
					{values.features.map((feature, i) => (
						<div key={feature.uuid} className={styles.feature}>
							<RemoveButton onClick={getHandleRemoveFeature(feature.uuid)} />
							<NumberTextInput
								id={`${getFeatureStr(i)}.level`}
								label="Level"
								value={feature.level}
								touched={clickedSubmit || getLevelTouched(i)}
								error={getLevelError(i)}
								onChange={getHandleLevelChange(i)}
								onBlur={getHandleLevelBlur(i)}
							/>
							<TextInput
								id={`${getFeatureStr(i)}.name`}
								label="Name"
								value={feature.name}
								touched={clickedSubmit || getNameTouched(i)}
								error={getNameError(i)}
								onChange={handleChange}
								onBlur={getHandleNameBlur(i)}
							/>
							<MarkdownTextArea
								id={`${getFeatureStr(i)}.description`}
								label="Description"
								value={feature.description}
								touched={clickedSubmit || getDescriptionTouched(i)}
								error={getDescriptionError(i)}
								onChange={getHandleDescriptionChange(i)}
								onBlur={getHandleDescriptionBlur(i)}
							/>
						</div>
					))}
				</div>
			)}
			{values.features.length < 20 && (
				<Button positive onClick={handleAddFeature}>
					Add Feature
				</Button>
			)}
		</section>
	);
};

export default Features;
