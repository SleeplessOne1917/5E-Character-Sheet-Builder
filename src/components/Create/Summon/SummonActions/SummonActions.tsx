'use client';

import { DeepError, DeepPartial, DeepTouched } from '../../../../types/helpers';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

import Button from '../../../Button/Button';
import { Summon } from '../../../../types/summon';
import TextInput from '../../../TextInput/TextInput';
import classes from './SummonActions.module.css';

export type SummonActionsProps = {
	summon: DeepPartial<Summon>;
	index: number;
	setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
	setFieldTouched: (
		field: string,
		isTouched?: boolean,
		shouldValidate?: boolean
	) => void;
	labelSingular: string;
	labelPlural: string;
	handleSetSummonProperties: (
		index: number,
		overrideProps: DeepPartial<Summon>
	) => void;
	touched: DeepTouched<Summon>[];
	errors: DeepError<Summon>[];
	id: 'specialAbilities' | 'actions' | 'bonusActions' | 'reactions';
};

const MAX_ACTIONS = 5;

const SummonActions = ({
	summon,
	index,
	setFieldTouched,
	setFieldValue,
	handleSetSummonProperties,
	touched,
	errors,
	labelPlural,
	labelSingular,
	id
}: SummonActionsProps) => (
	<div className={classes.actions} data-testid="summon-actions">
		{summon[id] && (summon[id]?.length ?? 0) > 0 && (
			<>
				<h3>{labelPlural}</h3>
				{summon[id]?.map((action, i) => (
					<div key={i} className={classes.action} data-testid="summon-action">
						<TextInput
							id={`summon-${index}-${id}-${i}-name`}
							label="Name"
							onChange={event => {
								setFieldValue(
									`summons.${index}.${id}.${i}.name`,
									event.target.value,
									false
								);
							}}
							value={action?.name ?? ''}
							onBlur={event => {
								handleSetSummonProperties(index, {
									[id]: summon[id]?.map((val, j) =>
										j === i
											? {
													...val,
													name: event.target.value
											  }
											: val
									)
								});
								setFieldTouched(`summons.${index}.${id}.${i}.name`);
							}}
							touched={
								touched
									? ((touched[index] ?? {})[id] ?? [{}])[i]?.name
									: undefined
							}
							error={
								errors
									? ((errors[index] ?? {})[id] ?? [{}])[i]?.name
									: undefined
							}
						/>
						{(id !== 'actions' || (summon[id]?.length ?? 0) > 1) && (
							<Button
								size="small"
								onClick={() => {
									const actions = summon[id]?.filter((_, j) => j !== i);
									handleSetSummonProperties(index, {
										[id]: actions
									});
									setFieldValue(`summons.${index}.${id}`, actions, false);
								}}
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
							htmlFor={`summons-${index}-${id}-${i}-description`}
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
								id={`summons-${index}-${id}-${i}-description`}
								className={`${classes['text-input']}${
									(touched
										? ((touched[index] ?? {})[id] ?? [{}])[i]?.description
										: false) &&
									(errors
										? ((errors[index] ?? {})[id] ?? [{}])[i]?.description
										: false)
										? ` ${classes.error}`
										: ''
								}`}
								rows={7}
								value={action?.description}
								onChange={event => {
									setFieldValue(
										`summons.${index}.${id}.${i}.description`,
										event.target.value,
										false
									);
								}}
								onBlur={event => {
									handleSetSummonProperties(index, {
										[id]: summon[id]?.map((val, j) =>
											j === i
												? {
														...val,
														description: event.target.value
												  }
												: val
										)
									});
									setFieldTouched(`summons.${index}.${id}.${i}.description`);
								}}
							></textarea>
							{(touched
								? ((touched[index] ?? {})[id] ?? [{}])[i]?.description
								: false) &&
								(errors
									? ((errors[index] ?? {})[id] ?? [{}])[i]?.description
									: false) && (
									<div className={classes['error-message']}>
										{((errors[index] ?? {})[id] ?? [{}])[i]?.description}
									</div>
								)}
						</div>
					</div>
				))}
			</>
		)}
		{(summon[id]?.length ?? 0) < MAX_ACTIONS && (
			<Button
				positive
				style={{
					display: 'flex',
					alignItems: 'center'
				}}
				onClick={() => {
					const actions = [
						...(summon[id] ?? []),
						{ name: '', description: '' }
					];

					handleSetSummonProperties(index, {
						[id]: actions
					});

					setFieldValue(`summons.${index}.${id}`, actions, false);
				}}
			>
				<PlusIcon className={classes['button-icon']} />
				Add {labelSingular}
			</Button>
		)}
	</div>
);

export default SummonActions;
