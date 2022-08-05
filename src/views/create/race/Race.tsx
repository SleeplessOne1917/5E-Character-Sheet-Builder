import {
	AbilityItem,
	SrdItem,
	SrdRace,
	SrdSubrace,
	SrdSubraceItem
} from '../../../types/srd';
import {
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import { addLanguage, removeLanguage } from '../../../redux/features/languages';
import { deselectRace, selectRace } from '../../../redux/features/raceInfo';
import { getRace, getSubrace } from '../../../services/raceService';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';

import Button from '../../../components/Button/Button';
import ChooseModal from '../../../components/character-creation/ChooseModal/ChooseModal';
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import { Descriptor } from '../../../types/creation';
import DescriptorComponent from '../../../components/character-creation/Descriptor/Descriptor';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import MainContent from '../../../components/MainContent/MainContent';
import RaceOption from '../../../components/character-creation/Race/RaceOption/RaceOption';
import SelectedRaceDisplay from '../../../components/character-creation/Race/SelectedRaceDisplay/SelectedRaceDisplay';
import { XCircleIcon } from '@heroicons/react/solid';
import classes from './Race.module.css';
import { getAbilityScoreDescription } from '../../../services/abilityBonusService';
import { updateRaceBonus } from '../../../redux/features/abilityScores';

type RaceProps = {
	races: SrdItem[];
	subraces: SrdSubraceItem[];
	abilities: AbilityItem[];
};

export const mockRaces = [
	{ index: 'dragonborn', name: 'DragonBorn' },
	{ index: 'dwarf', name: 'Dwarf' },
	{ index: 'elf', name: 'Elf' },
	{ index: 'gnome', name: 'Gnome' },
	{ index: 'half-elf', name: 'Half Elf' },
	{ index: 'half-orc', name: 'Half Orc' },
	{ index: 'halfling', name: 'Halfling' },
	{ index: 'human', name: 'Human' },
	{ index: 'tiefling', name: 'Tiefling' }
];

export const mockSubraces = [
	{ index: 'rock-gnome', name: 'Rock Gnome', race: { index: 'gnome' } },
	{ index: 'hill-dwarf', name: 'Hill Dwarf', race: { index: 'dwarf' } },
	{ index: 'high-elf', name: 'High Elf', race: { index: 'elf' } },
	{
		index: 'lightfoot-halfling',
		name: 'Lightfoot Halfling',
		race: { index: 'halfling' }
	}
];

const Race = ({ races, subraces, abilities }: RaceProps): JSX.Element => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showSelectModal, setShowSelectModal] = useState(false);
	const [showDeselectModal, setShowDeselectModal] = useState(false);
	const [consideredRace, setConsideredRace] = useState<SrdRace>();
	const [consideredSubrace, setConsideredSubrace] = useState<SrdSubrace>();
	const [consideredRaceIndex, setConsideredRaceIndex] = useState<string>();
	const [consideredSubraceIndex, setConsideredSubraceIndex] =
		useState<string>();
	const [descriptors, setDescriptors] = useState<Descriptor[]>();
	const mainRef = useRef<HTMLDivElement>();
	const dispatch = useAppDispatch();
	const raceInfo = useAppSelector(state => state.editingCharacter.raceInfo);

	useEffect(() => {
		if (consideredRace) {
			let theDescriptors: Descriptor[] = [
				{
					title: 'Ability Score Bonuses',
					description: getAbilityScoreDescription(
						consideredRace,
						consideredSubrace
					)
				},
				{
					title: 'Age',
					description: consideredRace.age
				},
				{
					title: 'Language',
					description: consideredRace.language_desc
				},
				{
					title: 'Size',
					description: consideredRace.size_description
				},
				{
					title: 'Alignment',
					description: consideredRace.alignment
				}
			];
			theDescriptors = theDescriptors.concat(
				consideredRace.traits.map(trait => ({
					title: trait.name,
					description: trait.desc
				}))
			);

			if (consideredSubrace) {
				theDescriptors = theDescriptors.concat(
					consideredSubrace.racial_traits.map(trait => ({
						title: trait.name,
						description: trait.desc
					}))
				);
			}

			setDescriptors(theDescriptors);
		} else {
			setDescriptors(undefined);
		}
	}, [consideredRace, setDescriptors, consideredSubrace]);

	useEffect(() => {
		if (consideredRaceIndex) {
			setLoading(true);
			setError(false);
			getRace(consideredRaceIndex).then(result => {
				if (result.data) {
					setConsideredRace(result.data.race);

					if (consideredSubraceIndex) {
						getSubrace(consideredSubraceIndex).then(result => {
							if (result.data) {
								setConsideredSubrace(result.data.subrace);
							} else {
								setError(true);
							}
							setLoading(false);
						});
					} else {
						setLoading(false);
					}
				} else {
					setLoading(false);
					setError(true);
				}
			});
		}
	}, [
		setConsideredRace,
		setConsideredSubrace,
		consideredRaceIndex,
		consideredSubraceIndex,
		setLoading,
		setError
	]);

	useEffect(() => {
		if (raceInfo.race) {
			mainRef.current?.scrollTo(0, 0);
		}
	}, [raceInfo, mainRef]);

	const getConsiderRaceHandler = useCallback(
		(raceIndex: string) => {
			return (subraceIndex?: string) => {
				setConsideredRaceIndex(raceIndex);

				if (subraceIndex) {
					setConsideredSubraceIndex(subraceIndex);
				}

				setShowSelectModal(true);
			};
		},
		[setConsideredRaceIndex, setConsideredSubraceIndex, setShowSelectModal]
	);

	const deselectConsideredRace = useCallback(() => {
		setConsideredRace(undefined);
		setConsideredRaceIndex(undefined);
		setConsideredSubrace(undefined);
		setConsideredSubraceIndex(undefined);
	}, [
		setConsideredRace,
		setConsideredRaceIndex,
		setConsideredSubrace,
		setConsideredSubraceIndex
	]);

	const closeSelectModal = useCallback(() => {
		setShowSelectModal(false);
		deselectConsideredRace();
	}, [setShowSelectModal, deselectConsideredRace]);

	const chooseRace = useCallback(() => {
		for (const { bonus, ability_score } of (
			consideredRace?.ability_bonuses ?? []
		).concat(consideredSubrace?.ability_bonuses ?? [])) {
			dispatch(
				updateRaceBonus({ abilityIndex: ability_score.index, value: bonus })
			);
		}
		for (const language of consideredRace?.languages ?? []) {
			dispatch(addLanguage(language));
		}
		dispatch(
			selectRace({
				race: consideredRace as SrdRace,
				subrace: consideredSubrace
			})
		);
		setShowSelectModal(false);
		deselectConsideredRace();
	}, [
		consideredRace,
		consideredSubrace,
		setShowSelectModal,
		deselectConsideredRace,
		dispatch
	]);

	const deselectSelectedRace = useCallback(() => {
		for (const { index } of (raceInfo.race?.languages ?? []).concat(
			raceInfo.selectedLanguages ?? []
		)) {
			dispatch(removeLanguage(index));
		}
		dispatch(deselectRace());
		setShowDeselectModal(false);
		for (const { index } of abilities) {
			dispatch(updateRaceBonus({ abilityIndex: index, value: null }));
		}
	}, [setShowDeselectModal, dispatch, abilities, raceInfo]);

	const tryDeselectRace = useCallback(() => {
		setShowDeselectModal(true);
	}, [setShowDeselectModal]);

	const cancelDeselectRace = useCallback(() => {
		setShowDeselectModal(false);
	}, [setShowDeselectModal]);

	const modalContent = (
		<>
			<h2 className={classes['modal-title']}>
				{loading
					? 'Loading...'
					: error
					? 'Error'
					: consideredSubrace
					? consideredSubrace?.name
					: consideredRace?.name}
			</h2>
			{loading ? (
				<LoadingSpinner />
			) : error ? (
				<p className={classes['error-message']}>Could not load race details</p>
			) : (
				descriptors &&
				descriptors.map(descriptor => (
					<DescriptorComponent
						key={descriptor.title}
						title={descriptor.title}
						description={descriptor.description}
					/>
				))
			)}
		</>
	);

	return (
		<>
			<MainContent
				testId="race"
				ref={mainRef as MutableRefObject<HTMLDivElement>}
			>
				{raceInfo.race && (
					<>
						<div className={classes['deselect-button-div']}>
							<h1 className={classes.title}>
								{raceInfo.subrace ? raceInfo.subrace.name : raceInfo.race.name}
							</h1>
							<Button
								onClick={tryDeselectRace}
								style={{
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<XCircleIcon className={classes['deselect-icon']} />
								Deselect Race
							</Button>
						</div>
						<SelectedRaceDisplay
							race={raceInfo.race}
							subrace={raceInfo.subrace}
						/>
					</>
				)}
				{!raceInfo.race && (
					<>
						<h1 className={classes.title}>Choose Race</h1>
						<ul className={classes['race-list']}>
							{races.map(race => (
								<RaceOption
									race={race}
									subraces={subraces.filter(
										subrace => subrace.race.index === race.index
									)}
									key={race.index}
									onChoose={getConsiderRaceHandler(race.index)}
									iconId={race.index}
									selectable={!showSelectModal}
								/>
							))}
						</ul>
					</>
				)}
			</MainContent>
			<ChooseModal
				show={showSelectModal}
				mainContent={modalContent}
				iconId={consideredRaceIndex ? consideredRaceIndex : 'custom-race'}
				onChoose={chooseRace}
				onClose={closeSelectModal}
			/>
			<ConfirmationModal
				message="Are you sure you want to deselect your race?"
				show={showDeselectModal}
				onNo={cancelDeselectRace}
				onYes={deselectSelectedRace}
			/>
		</>
	);
};

export default Race;
