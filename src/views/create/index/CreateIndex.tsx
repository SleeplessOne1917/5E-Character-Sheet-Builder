import ArrowLink from '../../../components/ArrowLink/ArrowLink';
import Link from 'next/link';
import MainContent from '../../../components/MainContent/MainContent';
import classes from './CreateIndex.module.css';
import { initialState as editingCharacterInitialState } from '../../../redux/features/editingCharacter';
import { initialState as editingSpellInitialState } from '../../../redux/features/editingSpell';
import { deepEquals } from '../../../services/objectService';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { useMemo } from 'react';
import { useRouter } from 'next/router';

const CreateIndex = () => {
	const router = useRouter();
	const editingCharacter = useAppSelector(state => state.editingCharacter);
	const editingSpell = useAppSelector(state => state.editingSpell);
	const viewer = useAppSelector(state => state.viewer);

	const editingCharacterChanged = useMemo(
		() => !deepEquals(editingCharacterInitialState, editingCharacter),
		[editingCharacter]
	);

	const editingSpellChanged = useMemo(
		() => !deepEquals(editingSpellInitialState, editingSpell),
		[editingSpell]
	);

	return (
		<MainContent testId="create-index">
			<h1>Create</h1>
			<div className={classes.links}>
				<div className={classes['create-link-container']}>
					<ArrowLink
						href={`${router.asPath}/character/race`}
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
				{viewer && (
					<>
						<div className={classes['create-link-container']}>
							<ArrowLink
								href={`${router.asPath}/spell`}
								text={`${
									editingSpellChanged ? 'Continue Editing' : 'Create'
								} Spell`}
							/>
						</div>
					</>
				)}
			</div>
			{!viewer && (
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
