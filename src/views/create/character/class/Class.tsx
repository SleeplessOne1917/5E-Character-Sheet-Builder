'use client';

import {
	AbilityItem,
	MonsterSubtype,
	MonsterType,
	SrdFullClassItem,
	SrdItem,
	SrdProficiencyItem
} from '../../../../types/srd';
import {
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import {
	addExpertiseProficiency,
	addFavoredEnemies,
	addFavoredTerrain,
	deselectClass,
	removeClassSpell,
	selectClass
} from '../../../../redux/features/classInfo';
import {
	addProficiency,
	removeProficiency
} from '../../../../redux/features/proficiencies';
import {
	decrementAbilityBonus,
	resetAbilityHighest,
	updateMiscBonus
} from '../../../../redux/features/abilityScores';
import {
	removeSpell,
	setCantripsKnown,
	setHighestSlotLevel,
	setSpellsKnown
} from '../../../../redux/features/spellcasting';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';

import Button from '../../../../components/Button/Button';
import ConfirmationModal from '../../../../components/ConfirmationModal/ConfirmationModal';
import { Descriptor } from '../../../../types/creation';
import GeneralInfoBar from '../../../../components/Create/Character/GeneralInfoBar/GeneralInfoBar';
import MainContent from '../../../../components/MainContent/MainContent';
import MoreInfoModal from '../../../../components/MoreInfoModal/MoreInfoModal';
import Option from '../../../../components/Create/Character/Option/Option';
import SelectedClassDisplay from '../../../../components/Create/Character/Class/SelectedClassDisplay/SelectedClassDisplay';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { getClass } from '../../../../services/classService';
import { getMonsterTypes } from '../../../../graphql/srdClientService';
import { removeLevelHPBonus } from '../../../../redux/features/hp';
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
	const mainRef = useRef<HTMLDivElement>();
	const [monsterTypes, setMonsterTypes] =
		useState<{ monsters: MonsterType[]; humanoids: MonsterSubtype[] }>();

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
							title: feature.name
								.replace(/\s+\(.*\)/, '')
								.replace(/Spellcasting:.*/, 'Spellcasting'),
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

	useEffect(() => {
		if (classInfo.class) {
			mainRef.current?.scrollTo(0, 0);
		}
	}, [classInfo.class]);

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
		if (consideredClassIndex === 'ranger') {
			dispatch(addFavoredEnemies([null]));
			dispatch(addFavoredTerrain(null));
		}

		if (consideredClassIndex === 'rogue') {
			for (let i = 0; i < 2; ++i) {
				dispatch(addExpertiseProficiency(null));
			}
		}

		dispatch(selectClass(consideredClass as SrdFullClassItem));

		for (const proficiency of consideredClass?.proficiencies ?? []) {
			dispatch(addProficiency(proficiency));
		}

		deselectConsideredClass();
		setShowSelectModal(false);
	}, [
		deselectConsideredClass,
		setShowSelectModal,
		dispatch,
		consideredClass,
		consideredClassIndex
	]);

	useEffect(() => {
		if (classInfo.class?.index === 'ranger') {
			getMonsterTypes().then(result => {
				setMonsterTypes({
					humanoids:
						result.data?.humanoids
							.map<MonsterSubtype>(({ subtype }) => subtype)
							.reduce<MonsterSubtype[]>((acc, cur) => {
								if (!(acc.includes(cur) || cur === 'ANY_RACE')) {
									return [...acc, cur];
								} else {
									return acc;
								}
							}, []) ?? [],
					monsters:
						result.data?.monsters
							.map<MonsterType>(({ type }) => type)
							.reduce<MonsterType[]>((acc, cur) => {
								if (!(acc.includes(cur) || cur === 'SWARM')) {
									return [...acc, cur];
								} else {
									return acc;
								}
							}, []) ?? []
				});
			});
		}
	}, [setMonsterTypes, classInfo.class?.index]);

	const tryDeselectClass = useCallback(() => {
		setShowDeselectModal(true);
	}, [setShowDeselectModal]);

	const cancelDeselectClass = useCallback(() => {
		setShowDeselectModal(false);
	}, [setShowDeselectModal]);

	const deselectSelectedClass = useCallback(() => {
		for (const { index } of (classInfo.class?.proficiencies ?? [])
			.concat(
				Object.values(classInfo.featuresProficiencies).flatMap(value => value)
			)
			.concat(
				classInfo.proficiencies
					.flatMap(values => values)
					.filter(prof => prof) as SrdProficiencyItem[]
			)) {
			dispatch(removeProficiency(index));
		}

		for (let i = 0; i < classInfo.level - 1; ++i) {
			dispatch(removeLevelHPBonus(undefined));
		}

		dispatch(setSpellsKnown(0));
		dispatch(setCantripsKnown(0));
		dispatch(setHighestSlotLevel(0));
		for (const { id } of classInfo.spells ?? []) {
			dispatch(removeClassSpell(id));
			dispatch(removeSpell(id));
		}

		if (classInfo.subclassSpells && classInfo.subclassSpells.length > 0) {
			for (const spell of classInfo.subclassSpells) {
				dispatch(removeSpell(spell.id));
			}
		}

		if (classInfo.level === 20 && classInfo.class?.index === 'barbarian') {
			dispatch(resetAbilityHighest('con'));
			dispatch(resetAbilityHighest('str'));

			dispatch(updateMiscBonus({ abilityIndex: 'con', value: null }));
			dispatch(updateMiscBonus({ abilityIndex: 'str', value: null }));
		}

		for (const abilityBonus of classInfo.abilityBonuses.flatMap(val => val)) {
			if (abilityBonus !== null) {
				dispatch(decrementAbilityBonus(abilityBonus));
			}
		}

		dispatch(deselectClass(undefined));
		setShowDeselectModal(false);
	}, [dispatch, setShowDeselectModal, classInfo]);

	return (
		<>
			<MainContent
				testId="class"
				ref={mainRef as MutableRefObject<HTMLDivElement>}
			>
				<GeneralInfoBar />
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
							monsterTypes={
								monsterTypes ?? {
									monsters: [],
									humanoids: []
								}
							}
						/>
					</>
				)}
			</MainContent>
			<MoreInfoModal
				iconId={consideredClassIndex as string}
				show={showSelectModal}
				onAction={handleChooseSelectModal}
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
