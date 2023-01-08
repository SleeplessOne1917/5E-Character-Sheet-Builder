'use client';

import {
	ChangeEventHandler,
	FocusEventHandler,
	useCallback,
	useMemo
} from 'react';
import {
	EditingClassState,
	FeatureState,
	addFeature,
	addFeaturePerLevelBonus,
	addFeaturePerLevelDice,
	addFeaturePerLevelDistance,
	addFeaturePerLevelMultiDice,
	addFeaturePerLevelNumber,
	removeFeature,
	removeFeaturePerLevelBonus,
	removeFeaturePerLevelDice,
	removeFeaturePerLevelDistance,
	removeFeaturePerLevelMultiDice,
	removeFeaturePerLevelNumber,
	setFeatureDescription,
	setFeatureLevel,
	setFeatureName,
	setFeaturePerLevelBonusName,
	setFeaturePerLevelDiceName,
	setFeaturePerLevelDistanceName,
	setFeaturePerLevelMultiDiceName,
	setFeaturePerLevelNumberName
} from '../../../../redux/features/editingClass';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';

import Button from '../../../Button/Button';
import MarkdownTextArea from '../../../MarkdownTextArea/MarkdownTextArea';
import NumberTextInput from '../../NumberTextInput/NumberTextInput';
import RemoveButton from '../../../RemoveButton/RemoveButton';
import TextInput from '../../../TextInput/TextInput';
import { XMarkIcon } from '@heroicons/react/24/solid';
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

	const hasReachedMaxPerLevels = useMemo(
		() =>
			values.features.reduce(
				(acc, cur) =>
					acc +
					(cur.perLevelNumbers?.length ?? 0) +
					(cur.perLevelBonuses?.length ?? 0) +
					(cur.perLevelDice?.length ?? 0) +
					(cur.perLevelDistances?.length ?? 0) +
					(cur.perLevelMultiDice?.length ?? 0),
				0
			) >= 5,
		[values.features]
	);

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
			setFieldValue(`${getFeatureStr(index)}.description`, value, false);
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
				setFieldValue(
					`${getFeatureStr(index)}.level`,
					event.target.value,
					false
				);
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

	const getHandleAddPerLevelNumber = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addFeaturePerLevelNumber(index));
			}

			setFieldValue(
				`${getFeatureStr(index)}.perLevelNumbers`,
				[
					...(values.features[index].perLevelNumbers ?? []),
					{ name: '', levels: Array(20).map(() => null) }
				],
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getPerLevelNumberNameTouched = useCallback(
		(featureIndex: number, numberIndex: number) =>
			getFeatureTouched(featureIndex)?.perLevelNumbers &&
			(
				getFeatureTouched(featureIndex)
					?.perLevelNumbers as unknown as FormikTouched<{
					name: string;
				}>[]
			)[numberIndex]?.name,
		[getFeatureTouched]
	);

	const getPerLevelNumberNameError = useCallback(
		(featureIndex: number, numberIndex: number) =>
			getFeatureError(featureIndex)?.perLevelNumbers
				? (
						getFeatureError(featureIndex)
							?.perLevelNumbers as unknown as FormikErrors<{ name: string }>[]
				  )[numberIndex]?.name
				: undefined,
		[getFeatureError]
	);

	const getHandlePerLevelNumberNameBlur = useCallback(
		(
				featureIndex: number,
				numberIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelNumberName({
							featureIndex,
							numberIndex,
							name: event.target.value
						})
					);
				}

				handleBlur(event);
			},
		[shouldUseReduxStore, dispatch, handleBlur]
	);

	const getHandleRemovePerLevelNumber = useCallback(
		(featureIndex: number, numberIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeFeaturePerLevelNumber({ featureIndex, numberIndex }));
			}

			const newLNs = values.features[featureIndex].perLevelNumbers?.filter(
				(_, i) => i !== numberIndex
			);

			setFieldValue(
				`${getFeatureStr(featureIndex)}.perLevelNumbers`,
				newLNs?.length === 0 ? undefined : newLNs,
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getHandleAddPerLevelDice = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addFeaturePerLevelDice(index));
			}

			setFieldValue(
				`${getFeatureStr(index)}.perLevelDice`,
				[
					...(values.features[index].perLevelDice ?? []),
					{ name: '', levels: Array(20).map(() => null) }
				],
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getPerLevelDiceNameTouched = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureTouched(featureIndex)?.perLevelDice &&
			(
				getFeatureTouched(featureIndex)
					?.perLevelDice as unknown as FormikTouched<{
					name: string;
				}>[]
			)[diceIndex]?.name,
		[getFeatureTouched]
	);

	const getPerLevelDiceNameError = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureError(featureIndex)?.perLevelDice
				? (
						getFeatureError(featureIndex)
							?.perLevelDice as unknown as FormikErrors<{ name: string }>[]
				  )[diceIndex]?.name
				: undefined,
		[getFeatureError]
	);

	const getHandlePerLevelDiceNameBlur = useCallback(
		(
				featureIndex: number,
				diceIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelDiceName({
							featureIndex,
							diceIndex,
							name: event.target.value
						})
					);
				}

				handleBlur(event);
			},
		[shouldUseReduxStore, dispatch, handleBlur]
	);

	const getHandleRemovePerLevelDice = useCallback(
		(featureIndex: number, diceIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeFeaturePerLevelDice({ featureIndex, diceIndex }));
			}

			const newLNs = values.features[featureIndex].perLevelDice?.filter(
				(_, i) => i !== diceIndex
			);

			setFieldValue(
				`${getFeatureStr(featureIndex)}.perLevelDice`,
				newLNs?.length === 0 ? undefined : newLNs,
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getHandleAddPerLevelMultiDice = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addFeaturePerLevelMultiDice(index));
			}

			setFieldValue(
				`${getFeatureStr(index)}.perLevelMultiDice`,
				[
					...(values.features[index].perLevelMultiDice ?? []),
					{ name: '', levels: Array(20).map(() => null) }
				],
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getPerLevelMultiDiceNameTouched = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureTouched(featureIndex)?.perLevelMultiDice &&
			(
				getFeatureTouched(featureIndex)
					?.perLevelMultiDice as unknown as FormikTouched<{
					name: string;
				}>[]
			)[diceIndex]?.name,
		[getFeatureTouched]
	);

	const getPerLevelMultiDiceNameError = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureError(featureIndex)?.perLevelMultiDice
				? (
						getFeatureError(featureIndex)
							?.perLevelMultiDice as unknown as FormikErrors<{ name: string }>[]
				  )[diceIndex]?.name
				: undefined,
		[getFeatureError]
	);

	const getHandlePerLevelMultiDiceNameBlur = useCallback(
		(
				featureIndex: number,
				diceIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelMultiDiceName({
							featureIndex,
							diceIndex,
							name: event.target.value
						})
					);
				}

				handleBlur(event);
			},
		[shouldUseReduxStore, dispatch, handleBlur]
	);

	const getHandleRemovePerLevelMultiDice = useCallback(
		(featureIndex: number, diceIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeFeaturePerLevelMultiDice({ featureIndex, diceIndex }));
			}

			const newLNs = values.features[featureIndex].perLevelMultiDice?.filter(
				(_, i) => i !== diceIndex
			);

			setFieldValue(
				`${getFeatureStr(featureIndex)}.perLevelMultiDice`,
				newLNs?.length === 0 ? undefined : newLNs,
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getHandleAddPerLevelBonus = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addFeaturePerLevelBonus(index));
			}

			setFieldValue(
				`${getFeatureStr(index)}.perLevelBonuses`,
				[
					...(values.features[index].perLevelBonuses ?? []),
					{ name: '', levels: Array(20).map(() => null) }
				],
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getPerLevelBonusNameTouched = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureTouched(featureIndex)?.perLevelBonuses &&
			(
				getFeatureTouched(featureIndex)
					?.perLevelBonuses as unknown as FormikTouched<{
					name: string;
				}>[]
			)[diceIndex]?.name,
		[getFeatureTouched]
	);

	const getPerLevelBonusNameError = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureError(featureIndex)?.perLevelBonuses
				? (
						getFeatureError(featureIndex)
							?.perLevelBonuses as unknown as FormikErrors<{ name: string }>[]
				  )[diceIndex]?.name
				: undefined,
		[getFeatureError]
	);

	const getHandlePerLevelBonusNameBlur = useCallback(
		(
				featureIndex: number,
				bonusIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelBonusName({
							featureIndex,
							bonusIndex,
							name: event.target.value
						})
					);
				}

				handleBlur(event);
			},
		[shouldUseReduxStore, dispatch, handleBlur]
	);

	const getHandleRemovePerLevelBonus = useCallback(
		(featureIndex: number, bonusIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeFeaturePerLevelBonus({ featureIndex, bonusIndex }));
			}

			const newLNs = values.features[featureIndex].perLevelBonuses?.filter(
				(_, i) => i !== bonusIndex
			);

			setFieldValue(
				`${getFeatureStr(featureIndex)}.perLevelBonuses`,
				newLNs?.length === 0 ? undefined : newLNs,
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getHandleAddPerLevelDistance = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addFeaturePerLevelDistance(index));
			}

			setFieldValue(
				`${getFeatureStr(index)}.perLevelDistances`,
				[
					...(values.features[index].perLevelDistances ?? []),
					{ name: '', levels: Array(20).map(() => null) }
				],
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getPerLevelDistanceNameTouched = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureTouched(featureIndex)?.perLevelDistances &&
			(
				getFeatureTouched(featureIndex)
					?.perLevelDistances as unknown as FormikTouched<{
					name: string;
				}>[]
			)[diceIndex]?.name,
		[getFeatureTouched]
	);

	const getPerLevelDistanceNameError = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureError(featureIndex)?.perLevelDistances
				? (
						getFeatureError(featureIndex)
							?.perLevelDistances as unknown as FormikErrors<{ name: string }>[]
				  )[diceIndex]?.name
				: undefined,
		[getFeatureError]
	);

	const getHandlePerLevelDistanceNameBlur = useCallback(
		(
				featureIndex: number,
				distanceIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelDistanceName({
							featureIndex,
							distanceIndex,
							name: event.target.value
						})
					);
				}

				handleBlur(event);
			},
		[shouldUseReduxStore, dispatch, handleBlur]
	);

	const getHandleRemovePerLevelDistance = useCallback(
		(featureIndex: number, distanceIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(
					removeFeaturePerLevelDistance({ featureIndex, distanceIndex })
				);
			}

			const newLNs = values.features[featureIndex].perLevelDistances?.filter(
				(_, i) => i !== distanceIndex
			);

			setFieldValue(
				`${getFeatureStr(featureIndex)}.perLevelDistances`,
				newLNs?.length === 0 ? undefined : newLNs,
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
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
							<div className={styles['per-level-container']}>
								<div className={styles['per-levels-title']}>Per Level Info</div>
								<p>
									Use this section to add Info that changes every level, such as
									the rogue class&apos;s sneak attack dice or the barbarian
									class&apos;s rages.
								</p>
								<div className={styles['per-levels']}>
									{(!hasReachedMaxPerLevels ||
										(feature.perLevelNumbers?.length ?? 0) > 0) && (
										<div className={styles['per-level']}>
											{(feature.perLevelNumbers?.length ?? 0) > 0 && (
												<>
													<div className={styles['per-level-title']}>
														Numbers
													</div>
													{feature.perLevelNumbers?.map((pl, j) => (
														<div key={j} className={styles['input-container']}>
															<TextInput
																id={`${getFeatureStr(
																	i
																)}.perLevelNumbers.${j}.name`}
																label="Name"
																value={pl.name}
																touched={
																	clickedSubmit ||
																	getPerLevelNumberNameTouched(i, j)
																}
																error={getPerLevelNumberNameError(i, j)}
																onChange={handleChange}
																onBlur={getHandlePerLevelNumberNameBlur(i, j)}
															/>
															<button
																className={styles['remove-button']}
																onClick={getHandleRemovePerLevelNumber(i, j)}
																type="button"
															>
																<XMarkIcon className={styles['remove-icon']} />
															</button>
														</div>
													))}
												</>
											)}
											{!hasReachedMaxPerLevels && (
												<Button
													positive
													onClick={getHandleAddPerLevelNumber(i)}
													style={{ margin: '0 auto' }}
												>
													Add Number
												</Button>
											)}
										</div>
									)}
									{(!hasReachedMaxPerLevels ||
										(feature.perLevelDice?.length ?? 0) > 0) && (
										<div className={styles['per-level']}>
											{(feature.perLevelDice?.length ?? 0) > 0 && (
												<>
													<div className={styles['per-level-title']}>Dice</div>
													{feature.perLevelDice?.map((pl, j) => (
														<div key={j} className={styles['input-container']}>
															<TextInput
																id={`${getFeatureStr(
																	i
																)}.perLevelDice.${j}.name`}
																label="Name"
																value={pl.name}
																touched={
																	clickedSubmit ||
																	getPerLevelDiceNameTouched(i, j)
																}
																error={getPerLevelDiceNameError(i, j)}
																onChange={handleChange}
																onBlur={getHandlePerLevelDiceNameBlur(i, j)}
															/>
															<button
																className={styles['remove-button']}
																onClick={getHandleRemovePerLevelDice(i, j)}
																type="button"
															>
																<XMarkIcon className={styles['remove-icon']} />
															</button>
														</div>
													))}
												</>
											)}
											{!hasReachedMaxPerLevels && (
												<Button
													positive
													onClick={getHandleAddPerLevelDice(i)}
													style={{ margin: '0 auto' }}
												>
													Add Dice
												</Button>
											)}
										</div>
									)}
									{(!hasReachedMaxPerLevels ||
										(feature.perLevelMultiDice?.length ?? 0) > 0) && (
										<div className={styles['per-level']}>
											{(feature.perLevelMultiDice?.length ?? 0) > 0 && (
												<>
													<div className={styles['per-level-title']}>
														Multi Dice
													</div>
													{feature.perLevelMultiDice?.map((pl, j) => (
														<div key={j} className={styles['input-container']}>
															<TextInput
																id={`${getFeatureStr(
																	i
																)}.perLevelMultiDice.${j}.name`}
																label="Name"
																value={pl.name}
																touched={
																	clickedSubmit ||
																	getPerLevelMultiDiceNameTouched(i, j)
																}
																error={getPerLevelMultiDiceNameError(i, j)}
																onChange={handleChange}
																onBlur={getHandlePerLevelMultiDiceNameBlur(
																	i,
																	j
																)}
															/>
															<button
																className={styles['remove-button']}
																onClick={getHandleRemovePerLevelMultiDice(i, j)}
																type="button"
															>
																<XMarkIcon className={styles['remove-icon']} />
															</button>
														</div>
													))}
												</>
											)}
											{!hasReachedMaxPerLevels && (
												<Button
													positive
													onClick={getHandleAddPerLevelMultiDice(i)}
													style={{ margin: '0 auto' }}
												>
													Add Multi Dice
												</Button>
											)}
										</div>
									)}
									{(!hasReachedMaxPerLevels ||
										(feature.perLevelBonuses?.length ?? 0) > 0) && (
										<div className={styles['per-level']}>
											{(feature.perLevelBonuses?.length ?? 0) > 0 && (
												<>
													<div className={styles['per-level-title']}>
														Bonuses
													</div>
													{feature.perLevelBonuses?.map((pl, j) => (
														<div key={j} className={styles['input-container']}>
															<TextInput
																id={`${getFeatureStr(
																	i
																)}.perLevelBonuses.${j}.name`}
																label="Name"
																value={pl.name}
																touched={
																	clickedSubmit ||
																	getPerLevelBonusNameTouched(i, j)
																}
																error={getPerLevelBonusNameError(i, j)}
																onChange={handleChange}
																onBlur={getHandlePerLevelBonusNameBlur(i, j)}
															/>
															<button
																className={styles['remove-button']}
																onClick={getHandleRemovePerLevelBonus(i, j)}
																type="button"
															>
																<XMarkIcon className={styles['remove-icon']} />
															</button>
														</div>
													))}
												</>
											)}
											{!hasReachedMaxPerLevels && (
												<Button
													positive
													onClick={getHandleAddPerLevelBonus(i)}
													style={{ margin: '0 auto' }}
												>
													Add Bonus
												</Button>
											)}
										</div>
									)}
									{(!hasReachedMaxPerLevels ||
										(feature.perLevelDistances?.length ?? 0) > 0) && (
										<div className={styles['per-level']}>
											{(feature.perLevelDistances?.length ?? 0) > 0 && (
												<>
													<div className={styles['per-level-title']}>
														Distances
													</div>
													{feature.perLevelDistances?.map((pl, j) => (
														<div key={j} className={styles['input-container']}>
															<TextInput
																id={`${getFeatureStr(
																	i
																)}.perLevelDistances.${j}.name`}
																label="Name"
																value={pl.name}
																touched={
																	clickedSubmit ||
																	getPerLevelDistanceNameTouched(i, j)
																}
																error={getPerLevelDistanceNameError(i, j)}
																onChange={handleChange}
																onBlur={getHandlePerLevelDistanceNameBlur(i, j)}
															/>
															<button
																className={styles['remove-button']}
																onClick={getHandleRemovePerLevelDistance(i, j)}
																type="button"
															>
																<XMarkIcon className={styles['remove-icon']} />
															</button>
														</div>
													))}
												</>
											)}
											{!hasReachedMaxPerLevels && (
												<Button
													positive
													onClick={getHandleAddPerLevelDistance(i)}
													style={{ margin: '0 auto' }}
												>
													Add Distance
												</Button>
											)}
										</div>
									)}
								</div>
							</div>
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
