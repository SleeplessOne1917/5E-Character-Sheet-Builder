import { AbilityItem, SrdFullClassItem, SrdItem } from '../../../../types/srd';
import {
	addProficiency,
	removeProficiency
} from '../../../../redux/features/proficiencies';
import {
	deselectClass,
	selectClass
} from '../../../../redux/features/classInfo';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import { useCallback, useEffect, useState } from 'react';

import Button from '../../../../components/Button/Button';
import ChooseModal from '../../../../components/character-creation/ChooseModal/ChooseModal';
import ConfirmationModal from '../../../../components/ConfirmationModal/ConfirmationModal';
import { Descriptor } from '../../../../types/creation';
import MainContent from '../../../../components/MainContent/MainContent';
import Option from '../../../../components/character-creation/Option/Option';
import SelectedClassDisplay from '../../../../components/character-creation/Class/SelectedClassDisplay/SelectedClassDisplay';
import { XCircleIcon } from '@heroicons/react/solid';
import { decrementAbilityBonus } from '../../../../redux/features/abilityScores';
import { getClass } from '../../../../services/classService';
import styles from './Class.module.css';

type ClassProps = {
	classes: SrdItem[];
	abilities: AbilityItem[];
};

export const mockClasses: SrdItem[] = [
	{
		index: 'wizard',
		name: 'Wizard'
	},
	{
		index: 'paladin',
		name: 'Paladin'
	},
	{
		index: 'cleric',
		name: 'Cleric'
	},
	{
		index: 'monk',
		name: 'Monk'
	},
	{
		index: 'rogue',
		name: 'Rogue'
	},
	{
		index: 'bard',
		name: 'Bard'
	},
	{
		index: 'ranger',
		name: 'Ranger'
	},
	{
		index: 'warlock',
		name: 'Warlock'
	},
	{
		index: 'sorcerer',
		name: 'Sorcerer'
	},
	{
		index: 'barbarian',
		name: 'Barbarian'
	},
	{
		index: 'druid',
		name: 'Druid'
	},
	{
		index: 'fighter',
		name: 'Fighter'
	}
];

const Class = ({ classes, abilities }: ClassProps): JSX.Element => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [consideredClassIndex, setConsideredClassIndex] = useState<string>();
	const [consideredClass, setConsideredClass] = useState<SrdFullClassItem>();
	const [descriptors, setDescriptors] = useState<Descriptor[]>();
	const [otherDescriptors, setOtherDescriptors] = useState<Descriptor[]>();
	const [showSelectModal, setShowSelectModal] = useState(false);
	const [showDeselectModal, setShowDeselectModal] = useState(false);
	const classInfo = useAppSelector(state => state.editingCharacter.classInfo);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (consideredClassIndex) {
			setLoading(true);
			setError(false);
			getClass(consideredClassIndex).then(result => {
				if (result.data) {
					setConsideredClass(result.data.class);
				} else {
					setError(true);
				}

				setLoading(false);
			});
		}
	}, [setLoading, setError, setConsideredClass, consideredClassIndex]);

	useEffect(() => {
		if (consideredClass) {
			const theDescriptors: Descriptor[] = [...consideredClass.class_levels]
				.sort((a, b) => a.level - b.level)
				.filter(level => !level.subclass)
				.flatMap(level =>
					level.features
						.filter(
							feature => !feature.name.match(/Ability Score Improvement/i)
						)
						.map<Descriptor>(feature => ({
							title: feature.name.replace(/\s+\(.*\)/, ''),
							description: feature.desc
						}))
				)
				.reduce<Descriptor[]>((acc, cur) => {
					if (!acc.some(descriptor => descriptor.title === cur.title)) {
						return [...acc, cur];
					} else {
						return acc;
					}
				}, []);

			const theOtherDescriptors = [
				{ title: 'Hit Die', description: `d${consideredClass.hit_die}` },
				{
					title: 'Saving Throws',
					description: consideredClass.saving_throws
						.map(({ full_name }) => full_name)
						.join(' and ')
				}
			];

			if (consideredClass.spellcasting) {
				theOtherDescriptors.push({
					title: 'Spellcasting Ability',
					description:
						consideredClass.spellcasting.spellcasting_ability.full_name
				});
			}

			setOtherDescriptors(theOtherDescriptors);
			setDescriptors(theDescriptors);
		}
	}, [consideredClass, setDescriptors]);

	const handleChooseClassOption = useCallback(
		(index: string) => {
			setConsideredClassIndex(index);
			setShowSelectModal(true);
		},
		[setConsideredClassIndex, setShowSelectModal]
	);

	const deselectConsideredClass = useCallback(() => {
		setOtherDescriptors(undefined);
		setDescriptors(undefined);
		setConsideredClass(undefined);
		setConsideredClassIndex(undefined);
	}, [
		setConsideredClassIndex,
		setConsideredClass,
		setDescriptors,
		setOtherDescriptors
	]);

	const handleCancelSelectModal = useCallback(() => {
		deselectConsideredClass();
		setShowSelectModal(false);
	}, [deselectConsideredClass, setShowSelectModal]);

	const handleChooseSelectModal = useCallback(() => {
		dispatch(selectClass(consideredClass as SrdFullClassItem));

		for (const proficiency of consideredClass?.proficiencies ?? []) {
			dispatch(addProficiency(proficiency));
		}

		deselectConsideredClass();
		setShowSelectModal(false);
	}, [deselectConsideredClass, setShowSelectModal, dispatch, consideredClass]);

	const tryDeselectClass = useCallback(() => {
		setShowDeselectModal(true);
	}, [setShowDeselectModal]);

	const cancelDeselectClass = useCallback(() => {
		setShowDeselectModal(false);
	}, [setShowDeselectModal]);

	const deselectSelectedClass = useCallback(() => {
		for (const { index } of classInfo.class?.proficiencies ?? []) {
			dispatch(removeProficiency(index));
		}

		for (const abilityBonus of classInfo.abilityBonuses.flatMap(val => val)) {
			if (abilityBonus !== null) {
				dispatch(decrementAbilityBonus(abilityBonus));
			}
		}

		dispatch(deselectClass());
		setShowDeselectModal(false);
	}, [dispatch, setShowDeselectModal, classInfo]);

	return (
		<>
			<MainContent testId="class">
				{!classInfo.class && (
					<>
						<h1 className={styles.title}>Choose Class</h1>
						<ul className={styles['class-list']}>
							{classes
								.sort((a, b) => a.index.localeCompare(b.index))
								.map(klass => (
									<Option
										key={klass.index}
										option={klass}
										onChoose={() => handleChooseClassOption(klass.index)}
									/>
								))}
						</ul>
					</>
				)}
				{classInfo.class && (
					<>
						<div className={styles['deselect-button-div']}>
							<h1 className={styles.title}>{classInfo.class.name}</h1>
							<Button
								onClick={tryDeselectClass}
								style={{
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<XCircleIcon className={styles['deselect-icon']} />
								Deselect Class
							</Button>
						</div>
						<SelectedClassDisplay
							klass={classInfo.class}
							abilities={abilities}
						/>
					</>
				)}
			</MainContent>
			<ChooseModal
				iconId={consideredClassIndex as string}
				show={showSelectModal}
				onChoose={handleChooseSelectModal}
				onClose={handleCancelSelectModal}
				descriptors={descriptors}
				otherDescriptors={otherDescriptors}
				title={consideredClass?.name as string}
				error={error}
				loading={loading}
			/>
			<ConfirmationModal
				message="Are you sure you want to deselect your class?"
				show={showDeselectModal}
				onNo={cancelDeselectClass}
				onYes={deselectSelectedClass}
			/>
		</>
	);
};

export default Class;
