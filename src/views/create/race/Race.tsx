import { SrdItem, SrdRace, SrdSubrace, SubraceItem } from '../../../types/srd';
import { getRace, getSubrace } from '../../../services/raceService';
import { useCallback, useEffect, useState } from 'react';

import ChooseModal from '../../../components/character-creation/ChooseModal/ChooseModal';
import { Descriptor } from '../../../types/creation';
import DescriptorComponent from '../../../components/character-creation/Descriptor/Descriptor';
import RaceOption from '../../../components/character-creation/Race/RaceOption';
import classes from './Race.module.css';
import commonClasses from '../../Views.module.css';

type RaceProps = {
	races: SrdItem[];
	subraces: SubraceItem[];
};

const Race = ({ races, subraces }: RaceProps): JSX.Element => {
	const [showModal, setShowModal] = useState(false);
	const [selectedRace, setSelectedRace] = useState<SrdRace | null>(null);
	const [selectedSubrace, setSelectedSubrace] = useState<SrdSubrace | null>();
	const [consideredRace, setConsideredRace] = useState<SrdRace | null>(null);
	const [consideredSubrace, setConsideredSubrace] = useState<SrdSubrace | null>(
		null
	);
	const [consideredRaceIndex, setConsideredRaceIndex] = useState<string | null>(
		null
	);
	const [consideredSubraceIndex, setConsideredSubraceIndex] = useState<
		string | null
	>(null);
	const [descriptors, setDescriptors] = useState<Descriptor[] | null>(null);

	useEffect(() => {
		if (consideredRace) {
			let theDescriptors: Descriptor[] = [
				{
					title: 'Age',
					description: consideredRace.age,
					isOpen: false
				},
				{
					title: 'Language',
					description: consideredRace.language_desc,
					isOpen: false
				},
				{
					title: 'Size',
					description: consideredRace.size_description,
					isOpen: false
				}
			];
			theDescriptors = theDescriptors.concat(
				consideredRace.traits.map(trait => ({
					title: trait.name,
					description: trait.desc,
					isOpen: false
				}))
			);

			setDescriptors(theDescriptors);
		} else {
			setDescriptors(null);
		}
	}, [consideredRace, setDescriptors]);

	useEffect(() => {
		if (consideredRaceIndex) {
			getRace(consideredRaceIndex).then(result => {
				setConsideredRace(result);
			});

			if (consideredSubraceIndex) {
				getSubrace(consideredSubraceIndex).then(result => {
					setConsideredSubrace(result);
				});
			}
		}
	}, [
		setConsideredRace,
		setConsideredSubrace,
		consideredRaceIndex,
		consideredSubraceIndex
	]);

	const getConsiderRaceHandler = useCallback(
		(raceIndex: string) => {
			return (subraceIndex?: string) => {
				setConsideredRaceIndex(raceIndex);

				if (subraceIndex) {
					setConsideredSubraceIndex(subraceIndex);
				}

				setShowModal(true);
			};
		},
		[setConsideredRaceIndex, setConsideredSubraceIndex, setShowModal]
	);

	const deselectConsideredRace = useCallback(() => {
		setConsideredRace(null);
		setConsideredRaceIndex(null);
		setConsideredSubrace(null);
		setConsideredSubraceIndex(null);
	}, [
		setConsideredRace,
		setConsideredRaceIndex,
		setConsideredSubrace,
		setConsideredSubraceIndex
	]);

	const closeModal = useCallback(() => {
		setShowModal(false);
		deselectConsideredRace();
	}, [setShowModal, deselectConsideredRace]);

	const chooseRace = useCallback(() => {
		setSelectedRace(consideredRace);
		setSelectedSubrace(consideredSubrace);
		setShowModal(false);
		deselectConsideredRace();
	}, [
		setSelectedRace,
		consideredRace,
		setSelectedSubrace,
		consideredSubrace,
		setShowModal,
		deselectConsideredRace
	]);

	const toggleDescriptor = useCallback(
		(index: number) => {
			if (descriptors) {
				const copy = [...descriptors];
				copy[index].isOpen = !copy[index].isOpen;
				setDescriptors(copy);
			}
		},
		[descriptors, setDescriptors]
	);

	const modalContent = (
		<>
			<h1 className={classes['modal-title']}>{consideredRace?.name}</h1>
			{descriptors &&
				descriptors.map((descriptor, index) => (
					<DescriptorComponent
						key={descriptor.title}
						title={descriptor.title}
						description={descriptor.description}
						isOpen={descriptor.isOpen}
						toggleOpen={() => toggleDescriptor(index)}
					/>
				))}
		</>
	);

	return (
		<>
			<main className={commonClasses.main}>
				<div className={commonClasses.content}>
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
							/>
						))}
					</ul>
				</div>
			</main>
			<ChooseModal
				show={showModal}
				mainContent={modalContent}
				onChoose={chooseRace}
				onClose={closeModal}
			/>
		</>
	);
};

export default Race;
