import {
	SrdItem,
	SrdRace,
	SrdSubrace,
	SrdSubraceItem
} from '../../../types/srd';
import { getRace, getSubrace } from '../../../services/raceService';
import {
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';

import Button from '../../../components/Button/Button';
import ChooseModal from '../../../components/character-creation/ChooseModal/ChooseModal';
import { Descriptor } from '../../../types/creation';
import DescriptorComponent from '../../../components/character-creation/Descriptor/Descriptor';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import MainContent from '../../../components/MainContent/MainContent';
import RaceOption from '../../../components/character-creation/Race/RaceOption/RaceOption';
import SelectedRaceDisplay from '../../../components/character-creation/Race/SelectedRaceDisplay/SelectedRaceDisplay';
import classes from './Race.module.css';
import { getAbilityScoreDescription } from '../../../services/abilityBonusService';
import useMediaQuery from '../../../hooks/useMediaQuery';
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';

type RaceProps = {
	races: SrdItem[];
	subraces: SrdSubraceItem[];
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

const Race = ({ races, subraces }: RaceProps): JSX.Element => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showSelectModal, setShowSelectModal] = useState(false);
	const [showDeselectModal, setShowDeselectModal] = useState(false);
	const [selectedRace, setSelectedRace] = useState<SrdRace>();
	const [selectedSubrace, setSelectedSubrace] = useState<SrdSubrace>();
	const [consideredRace, setConsideredRace] = useState<SrdRace>();
	const [consideredSubrace, setConsideredSubrace] = useState<SrdSubrace>();
	const [consideredRaceIndex, setConsideredRaceIndex] = useState<string>();
	const [consideredSubraceIndex, setConsideredSubraceIndex] =
		useState<string>();
	const [descriptors, setDescriptors] = useState<Descriptor[]>();
	const isSmallOrLarger = useMediaQuery('(min-width: 640px)');
	const mainRef = useRef<HTMLDivElement>();

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
		if (selectedRace) {
			mainRef.current?.scrollTo(0, 0);
		}
	}, [selectedRace, mainRef]);

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
		setSelectedRace(consideredRace);
		setSelectedSubrace(consideredSubrace);
		setShowSelectModal(false);
		deselectConsideredRace();
	}, [
		setSelectedRace,
		consideredRace,
		setSelectedSubrace,
		consideredSubrace,
		setShowSelectModal,
		deselectConsideredRace
	]);

	const deselectSelectedRace = useCallback(() => {
		setSelectedRace(undefined);
		setSelectedSubrace(undefined);
		setShowDeselectModal(false);
	}, [setSelectedRace, setSelectedSubrace, setShowDeselectModal]);

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
				{selectedRace && (
					<>
						<div className={classes['deselect-button-div']}>
							<h1 className={classes.title}>
								{selectedSubrace ? selectedSubrace.name : selectedRace.name}
							</h1>
							<Button
								size={isSmallOrLarger ? 'medium' : 'small'}
								onClick={tryDeselectRace}
							>
								Deselect Race
							</Button>
						</div>
						<SelectedRaceDisplay
							race={selectedRace}
							subrace={selectedSubrace}
						/>
					</>
				)}
				{!selectedRace && (
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
