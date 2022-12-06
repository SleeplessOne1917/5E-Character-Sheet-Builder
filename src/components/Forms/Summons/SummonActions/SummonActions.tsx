'use client';

import { FormikErrors, FormikTouched, useFormikContext } from 'formik';

import Button from '../../../Button/Button';
import { DeepPartial } from '../../../../types/helpers';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Summon } from '../../../../types/summon';
import SummonAction from '../SummonAction/SummonAction';
import classes from './SummonActions.module.css';
import { useCallback } from 'react';

type SummonActionsProps = {
	summon: DeepPartial<Summon>;
	parentBaseStr: string;
	labelSingular: string;
	labelPlural: string;
	onSetSummonProperties: (overrideProps: DeepPartial<Summon>) => void;
	id: 'specialAbilities' | 'actions' | 'bonusActions' | 'reactions';
	baseTouched:
		| boolean
		| FormikTouched<{ name?: string; description?: string }>[]
		| undefined;
	baseErrors:
		| string
		| string[]
		| FormikErrors<{ name?: string; description?: string }>[]
		| undefined;
};

const MAX_ACTIONS = 5;

const SummonActions = ({
	summon,
	onSetSummonProperties,
	labelPlural,
	labelSingular,
	id,
	parentBaseStr,
	baseErrors,
	baseTouched
}: SummonActionsProps) => {
	const { setFieldValue } =
		useFormikContext<{ summons?: DeepPartial<Summon>[] }>();

	const baseStr = `${parentBaseStr}.${id}`;

	const handleAddAction = useCallback(() => {
		const actions = [...(summon[id] ?? []), { name: '', description: '' }];

		onSetSummonProperties({
			[id]: actions
		});

		setFieldValue(baseStr, actions, false);
	}, [baseStr, setFieldValue, id, summon, onSetSummonProperties]);

	const getHandleSetActionProperties = useCallback(
		(index: number) => (value: { name?: string; description?: string }) => {
			onSetSummonProperties({
				[id]: summon[id]?.map((val, i) =>
					i === index
						? {
								...val,
								...value
						  }
						: val
				)
			});
		},
		[summon, id, onSetSummonProperties]
	);

	return (
		<div className={classes.actions} data-testid="summon-actions">
			{summon[id] && (summon[id]?.length ?? 0) > 0 && (
				<>
					<h3>{labelPlural}</h3>
					{summon[id]?.map((action, i) => (
						<SummonAction
							action={action}
							baseErrors={baseErrors ? baseErrors[i] : undefined}
							baseTouched={
								baseTouched && typeof baseTouched !== 'boolean'
									? baseTouched[i]
									: undefined
							}
							id={id}
							index={i}
							labelSingular={labelSingular}
							onSetActionProperties={getHandleSetActionProperties(i)}
							onSetSummonProperties={onSetSummonProperties}
							parentBaseStr={baseStr}
							summon={summon}
							key={i}
						/>
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
					onClick={handleAddAction}
				>
					<PlusIcon className={classes['button-icon']} />
					Add {labelSingular}
				</Button>
			)}
		</div>
	);
};

export default SummonActions;
