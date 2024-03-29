'use client';

import {
	AbilityItem,
	SrdFullRaceItem,
	SrdFullSubraceItem,
	SrdItem,
	SrdProficiencyItem,
	SrdSubraceItem
} from '../../../../types/srd';
import {
	AbilityScore,
	updateRaceBonus
} from '../../../../redux/features/abilityScores';
import {
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import {
	addLanguage,
	removeLanguage
} from '../../../../redux/features/languages';
import {
	addProficiency,
	removeProficiency
} from '../../../../redux/features/proficiencies';
import { deselectRace, selectRace } from '../../../../redux/features/raceInfo';
import { getRace, getSubrace } from '../../../../services/raceService';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';

import Button from '../../../../components/Button/Button';
import ConfirmationModal from '../../../../components/ConfirmationModal/ConfirmationModal';
import { Descriptor } from '../../../../types/creation';
import GeneralInfoBar from '../../../../components/Create/Character/GeneralInfoBar/GeneralInfoBar';
import MainContent from '../../../../components/MainContent/MainContent';
import MoreInfoModal from '../../../../components/MoreInfoModal/MoreInfoModal';
import Option from '../../../../components/Create/Character/Option/Option';
import SelectedRaceDisplay from '../../../../components/Create/Character/Race/SelectedRaceDisplay/SelectedRaceDisplay';
import { Spell } from '../../../../types/characterSheetBuilderAPI';
import { XCircleIcon } from '@heroicons/react/24/solid';
import classes from './Race.module.css';
import { getAbilityScoreDescription } from '../../../../services/abilityBonusService';
import { removeClassSpell } from '../../../../redux/features/classInfo';
import { removeSpell } from '../../../../redux/features/spellcasting';
import usePreparedSpells from '../../../../hooks/usePreparedSpells';

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
	const [consideredRace, setConsideredRace] = useState<SrdFullRaceItem>();
	const [consideredSubrace, setConsideredSubrace] =
		useState<SrdFullSubraceItem>();
	const [consideredRaceIndex, setConsideredRaceIndex] = useState<string>();
	const [consideredSubraceIndex, setConsideredSubraceIndex] =
		useState<string>();
	const [descriptors, setDescriptors] = useState<Descriptor[]>();
	const [otherDescriptors, setOtherDescriptors] = useState<Descriptor[]>();
	const mainRef = useRef<HTMLDivElement>();
	const dispatch = useAppDispatch();
	const raceInfo = useAppSelector(state => state.editingCharacter.raceInfo);
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
	const abilityScores = useAppSelector(
		state => state.editingCharacter.abilityScores
	);

	useEffect(() => {
		if (consideredRace) {
			let theDescriptors: Descriptor[] = [
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

			setOtherDescriptors([
				{
					title: 'Ability Score Bonuses',
					description: getAbilityScoreDescription(
						consideredRace,
						consideredSubrace
					)
				},
				{ title: 'Speed', description: `${consideredRace.speed} ft.` }
			]);
			setDescriptors(theDescriptors);
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
	}, [raceInfo.race]);

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
		setDescriptors(undefined);
		setOtherDescriptors(undefined);
	}, [
		setConsideredRace,
		setConsideredRaceIndex,
		setConsideredSubrace,
		setConsideredSubraceIndex,
		setDescriptors,
		setOtherDescriptors
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

		for (const proficiency of (consideredRace?.traits ?? []).flatMap(
			trait => trait.proficiencies
		)) {
			dispatch(addProficiency(proficiency));
		}

		dispatch(
			selectRace({
				race: consideredRace as SrdFullRaceItem,
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
		for (const { index } of (raceInfo.race?.languages ?? [])
			.concat(raceInfo.selectedLanguages ?? [])
			.concat(
				Object.keys(raceInfo.selectedTraitLanguages).reduce<SrdItem[]>(
					(acc, cur) => acc.concat(raceInfo.selectedTraitLanguages[cur]),
					[]
				)
			)) {
			dispatch(removeLanguage(index));
		}

		for (const { id } of Object.keys(raceInfo.selectedTraitSpells).reduce<
			Spell[]
		>((acc, cur) => acc.concat(raceInfo.selectedTraitSpells[cur]), [])) {
			dispatch(removeSpell(id));
		}

		for (const { index } of (raceInfo.race?.traits ?? [])
			.flatMap(trait => trait.proficiencies)
			.concat(
				Object.keys(raceInfo.selectedTraitProficiencies).reduce<
					SrdProficiencyItem[]
				>(
					(acc, cur) => acc.concat(raceInfo.selectedTraitProficiencies[cur]),
					[]
				)
			)) {
			dispatch(removeProficiency(index));
		}

		dispatch(deselectRace(undefined));
		setShowDeselectModal(false);

		for (const { index } of abilities) {
			dispatch(updateRaceBonus({ abilityIndex: index, value: null }));

			if (
				spellcastingAbility &&
				index === spellcastingAbility &&
				shouldPrepareSpells
			) {
				const newPreparedSpellsNumber = getNumberOfSpellsToPrepare({
					abilityScore: {
						...(
							abilityScores as {
								[key: string]: AbilityScore;
							}
						)[index],
						raceBonus: null
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
		}
	}, [
		setShowDeselectModal,
		dispatch,
		abilities,
		raceInfo,
		abilityScores,
		classSpells,
		getNumberOfSpellsToPrepare,
		shouldPrepareSpells,
		spellcastingAbility
	]);

	const tryDeselectRace = useCallback(() => {
		setShowDeselectModal(true);
	}, [setShowDeselectModal]);

	const cancelDeselectRace = useCallback(() => {
		setShowDeselectModal(false);
	}, [setShowDeselectModal]);

	return (
		<>
			<MainContent
				testId="race"
				ref={mainRef as MutableRefObject<HTMLDivElement>}
			>
				<GeneralInfoBar />
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
							{races
								.sort((a, b) => a.index.localeCompare(b.index))
								.map(race => (
									<Option
										option={race}
										subOptions={subraces.filter(
											subrace => subrace.race.index === race.index
										)}
										key={race.index}
										onChoose={getConsiderRaceHandler(race.index)}
									/>
								))}
						</ul>
					</>
				)}
			</MainContent>
			<MoreInfoModal
				show={showSelectModal}
				iconId={consideredRaceIndex ? consideredRaceIndex : 'custom-race'}
				onAction={chooseRace}
				onClose={closeSelectModal}
				loading={loading}
				error={error}
				title={
					consideredSubrace
						? consideredSubrace?.name
						: (consideredRace?.name as string)
				}
				descriptors={descriptors}
				otherDescriptors={otherDescriptors}
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
