import ArrowSmallRightIcon from '@heroicons/react/24/solid/ArrowSmallRightIcon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import MainContent from '../../../components/MainContent/MainContent';
import { useAppSelector } from '../../../hooks/reduxHooks';
import classes from './CreateIndex.module.css';
import { isEqual } from 'lodash';
import { initialState as editingCharacterInitialState } from '../../../redux/features/editingCharacter';

const CreateIndex = () => {
	const router = useRouter();
	const editingCharacter = useAppSelector(state => state.editingCharacter);
	const viewer = useAppSelector(state => state.viewer);

	const editingCharacterChanged = useMemo(
		() => !isEqual(editingCharacterInitialState, editingCharacter),
		[editingCharacter]
	);

	return (
		<MainContent testId="create-index">
			<h1>Create</h1>
			<div className={classes['create-link-container']}>
				<Link href={`${router.asPath}/character/race`}>
					<a className={classes['continue-link']}>
						{editingCharacterChanged
							? `Continue Editing ${
									editingCharacter.name.length > 0
										? editingCharacter.name
										: 'Character'
							  }`
							: 'Create Character'}
						<ArrowSmallRightIcon className={classes['link-arrow']} />
					</a>
				</Link>
			</div>
			{!viewer && (
				<div className={classes['create-account-blurb']}>
					Create classes, spells and more by{' '}
					<Link href="/sign-up">
						<a className={classes['create-account-link']}>
							creating an account
						</a>
					</Link>
					.
				</div>
			)}
		</MainContent>
	);
};

export default CreateIndex;
