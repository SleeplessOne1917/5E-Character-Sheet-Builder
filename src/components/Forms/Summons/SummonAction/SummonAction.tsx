'use client';

import { FocusEventHandler, useCallback, useMemo } from 'react';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';

import Button from '../../../Button/Button';
import { DeepPartial } from '../../../../types/helpers';
import { Summon } from '../../../../types/summon';
import TextInput from '../../../TextInput/TextInput';
import { XMarkIcon } from '@heroicons/react/24/solid';
import classes from './SummonAction.module.css';

type SummonActionsProps = {
	summon: DeepPartial<Summon>;
	parentBaseStr: string;
	labelSingular: string;
	onSetActionProperties: (overrideProps: {
		name?: string;
		description?: string;
	}) => void;
	onSetSummonProperties: (overrideProps: DeepPartial<Summon>) => void;
	id: 'specialAbilities' | 'actions' | 'bonusActions' | 'reactions';
	index: number;
	action: { name?: string; description?: string };
	baseTouched:
		| boolean
		| FormikTouched<{ name?: string; description?: string }>
		| undefined;
	baseErrors:
		| string
		| FormikErrors<{ name?: string; description?: string }>
		| undefined;
};

const SummonAction = ({
	id,
	index,
	labelSingular,
	onSetActionProperties,
	onSetSummonProperties,
	parentBaseStr,
	summon,
	action,
	baseErrors,
	baseTouched
}: SummonActionsProps) => {
	const { setFieldValue, handleChange, handleBlur } =
		useFormikContext<{ summons?: DeepPartial<Summon>[] }>();
	const baseStr = `${parentBaseStr}.${index}`;

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		event => {
			onSetActionProperties({ name: event.target.value });
			handleBlur(event);
		},
		[onSetActionProperties, handleBlur]
	);

	const handleDescriptionBlur: FocusEventHandler<HTMLTextAreaElement> =
		useCallback(
			event => {
				onSetActionProperties({ description: event.target.value });

				handleBlur(event);
			},
			[onSetActionProperties, handleBlur]
		);

	const handleRemoveAction = useCallback(() => {
		const actions = summon[id]?.filter((_, i) => i !== index);
		onSetSummonProperties({
			[id]: actions
		});

		setFieldValue(parentBaseStr, actions, false);
	}, [onSetSummonProperties, id, index, summon, parentBaseStr, setFieldValue]);

	const isDescriptionError = useMemo(
		() =>
			!baseTouched || typeof baseTouched === 'boolean'
				? baseTouched
				: baseTouched?.description &&
				  (!baseErrors || typeof baseErrors === 'string'
						? baseErrors
						: baseErrors?.description),
		[baseErrors, baseTouched]
	);

	return (
		<div className={classes.action} data-testid="summon-action">
			<TextInput
				id={`${baseStr}.name`}
				label="Name"
				onChange={handleChange}
				value={action?.name ?? ''}
				onBlur={handleNameBlur}
				touched={
					!baseTouched || typeof baseTouched === 'boolean'
						? baseTouched
						: baseTouched?.name
				}
				error={
					!baseErrors || typeof baseErrors === 'string'
						? baseErrors
						: baseErrors.name
				}
			/>
			{(id !== 'actions' || (summon[id]?.length ?? 0) > 1) && (
				<Button
					size="small"
					onClick={handleRemoveAction}
					style={{
						display: 'flex',
						alignItems: 'center',
						position: 'absolute',
						top: 0,
						right: 0,
						marginTop: '-0.1rem',
						marginRight: '-0.1rem',
						borderTopRightRadius: '1rem'
					}}
				>
					<XMarkIcon className={classes['close-button-icon']} />
					Remove {labelSingular}
				</Button>
			)}
			<label
				htmlFor={`${baseStr}.description`}
				className={classes['action-description-label']}
			>
				Description
			</label>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}
			>
				<textarea
					id={`${baseStr}.description`}
					className={`${classes['text-input']}${
						isDescriptionError ? ` ${classes.error}` : ''
					}`}
					rows={7}
					value={action?.description}
					onChange={handleChange}
					onBlur={handleDescriptionBlur}
				></textarea>
				{isDescriptionError && (
					<div className={classes['error-message']}>
						{
							(
								baseErrors as FormikErrors<{
									name?: string;
									description?: string;
								}>
							).description
						}
					</div>
				)}
			</div>
		</div>
	);
};

export default SummonAction;
