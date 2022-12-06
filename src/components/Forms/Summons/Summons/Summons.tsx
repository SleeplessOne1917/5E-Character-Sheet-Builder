'use client';

import {
	Action,
	PayloadAction
} from '@reduxjs/toolkit';

import { AbilityItem } from '../../../../types/srd';
import Button from '../../../Button/Button';
import { DeepPartial } from '../../../../types/helpers';
import { PlusIcon } from '@heroicons/react/24/solid';
import Summon from '../Summon/Summon';
import { Summon as SummonType } from '../../../../types/summon';
import classes from './Summons.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useCallback } from 'react';
import { useFormikContext } from 'formik';

type SummonsProps = {
	actions: {
		add: () => Action;
		set: (val: {
			index: number;
			overrideProps: DeepPartial<SummonType>;
		}) => PayloadAction<{
			index: number;
			overrideProps: DeepPartial<SummonType>;
		}>;
		delete: (val: number) => PayloadAction<number>;
	};
	abilities: AbilityItem[];
};

const MAX_SUMMONS = 5;

const Summons = ({ actions, abilities }: SummonsProps) => {
	const { setFieldValue, values } =
		useFormikContext<{ summons?: DeepPartial<SummonType>[] }>();
	const dispatch = useAppDispatch();

	const handleAddSummon = useCallback(() => {
		dispatch(actions.add());

		setFieldValue('summons', [
			...(values.summons ?? []),
			{
				actions: [{ name: '', description: '' }]
			}
		]);
	}, [dispatch, actions, setFieldValue, values.summons]);

	const AddSummonButton = useCallback(
		() => (
			<Button
				positive
				style={{ display: 'flex', alignItems: 'center' }}
				onClick={handleAddSummon}
			>
				<PlusIcon className={classes['button-icon']} /> Add Summon
			</Button>
		),
		[handleAddSummon]
	);

	return (
		<div className={classes.summons} data-testid="summon-form-fields">
			{values.summons && values.summons.length > 0 ? (
				<>
					<h2>Summons</h2>
					{values.summons.map((summon, index) => (
						<Summon
							abilities={abilities}
							index={index}
							reduxDelete={actions.delete}
							reduxSet={actions.set}
							summon={summon}
							key={index}
						/>
					))}
					{(values.summons?.length ?? 0) < MAX_SUMMONS && <AddSummonButton />}
				</>
			) : (
				<AddSummonButton />
			)}
		</div>
	);
};

export default Summons;
