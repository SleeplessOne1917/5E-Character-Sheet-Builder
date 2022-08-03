import {
	AbilityBonus,
	SrdItem,
	SrdRace,
	SrdSubrace,
	SrdSubraceItem
} from '../../../types/srd';
import { getRace, getSubrace } from '../../../services/raceService';
import { useCallback, useEffect, useState } from 'react';

import ChooseModal from '../../../components/character-creation/ChooseModal/ChooseModal';
import { Descriptor } from '../../../types/creation';
import DescriptorComponent from '../../../components/character-creation/Descriptor/Descriptor';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import MainContent from '../../../components/MainContent/MainContent';
import RaceOption from '../../../components/character-creation/Race/RaceOption';
import classes from './Race.module.css';

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

const reduceAbilityBonuses = (
	bonuses: AbilityBonus[],
	startDesc: string = ''
) =>
	bonuses.reduce(
		(acc, cur) =>
			`${acc}${acc === '' ? '' : ', '}+${cur.bonus} ${
				cur.ability_score.full_name
			}`,
		startDesc
	);

const getAbilityScoreDescription = (race: SrdRace, subrace?: SrdSubrace) => {
	let description: string;

	const allSameBonuses = race.ability_bonuses.reduce(
		(acc: { isSame: boolean; value?: number }, cur) => {
			if (!acc.value) {
				return {
					...acc,
					value: cur.bonus
				};
			} else {
				return {
					...acc,
					isSame: acc.value === cur.bonus
				};
			}
		},
		{ isSame: true, value: undefined }
	);

	if (allSameBonuses.isSame && race.ability_bonuses.length > 1) {
		description = `+${allSameBonuses.value} to ${race.ability_bonuses.reduce(
			(acc, cur, index) =>
				`${acc}${index === race.ability_bonuses.length - 1 ? 'and ' : ''}${
					cur.ability_score.full_name
				}${index === race.ability_bonuses.length - 1 ? '' : ', '}`,
			''
		)}`;
	} else {
		description = reduceAbilityBonuses(race.ability_bonuses);
	}

	if (subrace) {
		description = reduceAbilityBonuses(subrace.ability_bonuses, description);
	}

	if (race.ability_bonus_options) {
		const allSameBonusChoices = race.ability_bonus_options.from.options.reduce(
			(acc: { isSame: boolean; value?: number }, cur) => {
				if (!acc.value) {
					return {
						...acc,
						value: cur.bonus
					};
				} else {
					return {
						...acc,
						isSame: acc.value === cur.bonus
					};
				}
			},
			{ isSame: true, value: undefined }
		);

		if (allSameBonusChoices.isSame) {
			description = `${description}, and +${allSameBonusChoices.value} to ${
				race.ability_bonus_options.choose
			} from ${race.ability_bonus_options.from.options.reduce(
				(acc, cur, index) =>
					`${acc}${
						index === (race.ability_bonus_options?.from.options.length ?? 1) - 1
							? 'and '
							: ''
					}${cur.ability_score.full_name}${
						index === (race.ability_bonus_options?.from.options.length ?? 1) - 1
							? '.'
							: ', '
					}`,
				''
			)}`;
		} else {
			description = `${description}, and ${
				race.ability_bonus_options.choose
			} from ${race.ability_bonus_options.from.options.reduce(
				(acc, cur, index) =>
					`${acc}${
						index === (race.ability_bonus_options?.from.options.length ?? 1) - 1
							? 'and '
							: ''
					}+${cur.bonus} to ${cur.ability_score.full_name}}${
						cur.ability_score.full_name
					}${
						index === (race.ability_bonus_options?.from.options.length ?? 1) - 1
							? '.'
							: ', '
					}`,
				''
			)}`;
		}
	}

	if (!description.includes(' and ') && description.includes(',')) {
		const lastIndexOfComma = description.lastIndexOf(',');
		description =
			description.slice(0, lastIndexOfComma) +
			' and' +
			description.slice(lastIndexOfComma);
	}

	if (description.indexOf(',') === description.lastIndexOf(',')) {
		description = description.replace(/,/g, '');
	}

	if (!description.endsWith('.')) {
		description = description + '.';
	}

	return description;
};

const Race = ({ races, subraces }: RaceProps): JSX.Element => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [selectedRace, setSelectedRace] = useState<SrdRace>();
	const [selectedSubrace, setSelectedSubrace] = useState<SrdSubrace>();
	const [consideredRace, setConsideredRace] = useState<SrdRace>();
	const [consideredSubrace, setConsideredSubrace] = useState<SrdSubrace>();
	const [consideredRaceIndex, setConsideredRaceIndex] = useState<string>();
	const [consideredSubraceIndex, setConsideredSubraceIndex] =
		useState<string>();
	const [descriptors, setDescriptors] = useState<Descriptor[]>();

	useEffect(() => {
		if (consideredRace) {
			let theDescriptors: Descriptor[] = [
				{
					title: 'Ability Score Bonuses',
					description: getAbilityScoreDescription(
						consideredRace,
						consideredSubrace
					),
					isOpen: false
				},
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
				},
				{
					title: 'Alignment',
					description: consideredRace.alignment,
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
				setDescriptors(prevState =>
					prevState
						? prevState.map((descriptor, i) => {
								if (i === index) {
									return {
										...descriptor,
										isOpen: !descriptor.isOpen
									};
								} else {
									return descriptor;
								}
						  })
						: undefined
				);
			}
		},
		[descriptors, setDescriptors]
	);

	const modalContent = (
		<>
			<h2 className={classes['modal-title']}>
				{loading ? 'Loading...' : error ? 'Error' : consideredRace?.name}
			</h2>
			{loading ? (
				<LoadingSpinner />
			) : error ? (
				<p className={classes['error-message']}>Could not load race details</p>
			) : (
				descriptors &&
				descriptors.map((descriptor, index) => (
					<DescriptorComponent
						key={descriptor.title}
						title={descriptor.title}
						description={descriptor.description}
						isOpen={descriptor.isOpen}
						toggleOpen={() => toggleDescriptor(index)}
					/>
				))
			)}
		</>
	);

	return (
		<>
			<MainContent testId="race">
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
							selectable={!showModal}
						/>
					))}
				</ul>
			</MainContent>
			<ChooseModal
				show={showModal}
				mainContent={modalContent}
				iconId={consideredRaceIndex ? consideredRaceIndex : 'custom-race'}
				onChoose={chooseRace}
				onClose={closeModal}
			/>
		</>
	);
};

export default Race;
