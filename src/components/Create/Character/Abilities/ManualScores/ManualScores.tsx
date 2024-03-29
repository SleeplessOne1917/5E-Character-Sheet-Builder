'use client';

import {
	AbilityScore,
	AbilityScoresState,
	updateBase
} from '../../../../../redux/features/abilityScores';
import { ChangeEvent, FocusEvent, useCallback, useState } from 'react';
import {
	useAppDispatch,
	useAppSelector
} from '../../../../../hooks/reduxHooks';

import { AbilityItem } from '../../../../../types/srd';
import AbilityScores from '../../../../../types/abilityScores';
import classes from './ManualScores.module.css';
import { getTotalScore } from '../../../../../services/abilityScoreService';
import { removeClassSpell } from '../../../../../redux/features/classInfo';
import { removeSpell } from '../../../../../redux/features/spellcasting';
import useGetAbilityScore from '../../../../../hooks/useGetAbilityScore';
import usePreparedSpells from '../../../../../hooks/usePreparedSpells';

export type ManualScoresProps = {
	abilities: AbilityItem[];
};

type AbilityScoreStrings = {
	str?: string | null;
	dex?: string | null;
	con?: string | null;
	int?: string | null;
	wis?: string | null;
	cha?: string | null;
};

const getInitialAbilityScoreStrings = (abilityScores: AbilityScoresState) =>
	Object.entries(abilityScores).reduce(
		(prev, [key, value]) => ({
			...prev,
			[key]: value.base ? `${value.base}` : null
		}),
		{}
	);

const ManualScores = ({ abilities }: ManualScoresProps): JSX.Element => {
	const abilityScores = useAppSelector(
		state => state.editingCharacter.abilityScores
	);
	const dispatch = useAppDispatch();
	const getAbilityScore = useGetAbilityScore();
	const [abilityScoreStrings, setAbilityScoreStrings] =
		useState<AbilityScoreStrings>(getInitialAbilityScoreStrings(abilityScores));
	const { getNumberOfSpellsToPrepare, shouldPrepareSpells } =
		usePreparedSpells();
	const classSpells = useAppSelector(
		state => state.editingCharacter.classInfo.spells
	)?.filter(({ level }) => level > 0);
	const spellcastingAbility = useAppSelector(
		state =>
			state.editingCharacter.classInfo.class?.spellcasting?.spellcasting_ability
				.index
	);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>, abilityIndex: AbilityScores) => {
			setAbilityScoreStrings(prevState => ({
				...prevState,
				[abilityIndex]: event.target.value
			}));
		},
		[setAbilityScoreStrings]
	);

	const handleBlur = useCallback(
		(event: FocusEvent<HTMLInputElement>, abilityIndex: AbilityScores) => {
			let value: number | null = parseInt(event.target.value, 10);
			if (isNaN(value)) {
				value = null;
			} else {
				if (value < 3) {
					value = 3;
				}

				if (value > 18) {
					value = 18;
				}
			}

			if (
				spellcastingAbility &&
				abilityIndex === spellcastingAbility &&
				shouldPrepareSpells
			) {
				const newPreparedSpellsNumber = getNumberOfSpellsToPrepare({
					abilityScore: {
						...(
							abilityScores as {
								[key: string]: AbilityScore;
							}
						)[abilityIndex],
						base: value
					}
				});

				if (classSpells && newPreparedSpellsNumber < classSpells.length) {
					for (
						let i = 0;
						i < classSpells.length - newPreparedSpellsNumber;
						++i
					) {
						const spellToRemove = classSpells[classSpells.length - (i + 1)];

						dispatch(removeSpell(spellToRemove.id));
						dispatch(removeClassSpell(spellToRemove.id));
					}
				}
			}

			setAbilityScoreStrings(prevState => ({
				...prevState,
				[abilityIndex]: value
			}));
			dispatch(updateBase({ value, abilityIndex }));
		},
		[
			dispatch,
			setAbilityScoreStrings,
			abilityScores,
			classSpells,
			getNumberOfSpellsToPrepare,
			shouldPrepareSpells,
			spellcastingAbility
		]
	);

	return (
		<div
			className={classes['manual-scores']}
			role="region"
			aria-label="Manual Scores"
		>
			{abilities.map(ability => (
				<div key={ability.index} className={classes['manual-score']}>
					<label htmlFor={`manual-${ability.index}`}>{ability.full_name}</label>
					<input
						id={`manual-${ability.index}`}
						type="text"
						onBlur={event => handleBlur(event, ability.index as AbilityScores)}
						value={
							(abilityScoreStrings[ability.index as AbilityScores]
								? abilityScoreStrings[ability.index as AbilityScores]
								: '') as string
						}
						onChange={event =>
							handleChange(event, ability.index as AbilityScores)
						}
						placeholder="&mdash;"
					/>
					<div className={classes.total}>
						Total:{' '}
						{getAbilityScore(ability.index as AbilityScores).base
							? getTotalScore(getAbilityScore(ability.index as AbilityScores))
							: '\u2014'}
					</div>
				</div>
			))}
		</div>
	);
};

export default ManualScores;
