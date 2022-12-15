'use client';

import ArrowLink from '../../../components/ArrowLink/ArrowLink';
import Link from 'next/link';
import MainContent from '../../../components/MainContent/MainContent';
import classes from './CreateIndex.module.css';
import { deepEquals } from '../../../services/objectService';
import { initialState as editingCharacterInitialState } from '../../../redux/features/editingCharacter';
import { initialState as editingClassInitialState } from '../../../redux/features/editingClass';
import { initialState as editingRaceInitialState } from '../../../redux/features/editingRace';
import { initialState as editingSpellInitialState } from '../../../redux/features/editingSpell';
import { initialState as editingSubraceInitialState } from '../../../redux/features/editingSubrace';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

type CreateIndexProps = {
	username?: string;
};

const CreateIndex = ({ username }: CreateIndexProps) => {
	const editingCharacter = useAppSelector(state => state.editingCharacter);
	const editingSpell = useAppSelector(state => state.editingSpell);
	const editingRace = useAppSelector(state => state.editingRace);
	const editingSubrace = useAppSelector(state => state.editingSubrace);
	const editingClass = useAppSelector(state => state.editingClass);

	const pathname = usePathname();

	const editingCharacterChanged = useMemo(
		() => !deepEquals(editingCharacterInitialState, editingCharacter),
		[editingCharacter]
	);

	const editingSpellChanged = useMemo(
		() => !deepEquals(editingSpellInitialState, editingSpell),
		[editingSpell]
	);

	const editingRaceChanged = useMemo(
		() => !deepEquals(editingRaceInitialState, editingRace),
		[editingRace]
	);

	const editingSubraceChanged = useMemo(
		() => !deepEquals(editingSubraceInitialState, editingSubrace),
		[editingSubrace]
	);

	const editingClassChanged = useMemo(
		() => !deepEquals(editingClassInitialState, editingClass),
		[editingClass]
	);

	return (
		<MainContent testId="create-index">
			<h1>Create</h1>
			<div className={classes.links}>
				<div className={classes['create-link-container']}>
					<ArrowLink
						href={`${pathname}/character/race`}
						text={
							editingCharacterChanged
								? `Continue Editing ${
										editingCharacter.name.length > 0
											? editingCharacter.name
											: 'Character'
								  }`
								: 'Create Character'
						}
					/>
				</div>
				{username && (
					<>
						<div className={classes['create-link-container']}>
							<ArrowLink
								href={`${pathname}/spell`}
								text={`${
									editingSpellChanged ? 'Continue Editing' : 'Create'
								} Spell`}
							/>
						</div>
						<div className={classes['create-link-container']}>
							<ArrowLink
								href={`${pathname}/race`}
								text={`${
									editingRaceChanged ? 'Continue Editing' : 'Create'
								} Race`}
							/>
						</div>
						<div className={classes['create-link-container']}>
							<ArrowLink
								href={`${pathname}/subrace`}
								text={`${
									editingSubraceChanged ? 'Continue Editing' : 'Create'
								} Subrace`}
							/>
						</div>
						<div className={classes['create-link-container']}>
							<ArrowLink
								href={`${pathname}/class`}
								text={`${
									editingClassChanged ? 'Continue Editing' : 'Create'
								} Class`}
							/>
						</div>
					</>
				)}
			</div>
			{!username && (
				<div className={classes['create-account-blurb']}>
					Create classes, spells, and more by{' '}
					<Link href="/sign-up" className={classes['create-account-link']}>
						creating an account
					</Link>
					.
				</div>
			)}
		</MainContent>
	);
};

export default CreateIndex;
