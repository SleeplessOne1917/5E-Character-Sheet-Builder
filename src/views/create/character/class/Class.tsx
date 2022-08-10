import { useCallback, useEffect, useState } from 'react';
import ChooseModal from '../../../../components/character-creation/ChooseModal/ChooseModal';
import Option from '../../../../components/character-creation/Option/Option';
import MainContent from '../../../../components/MainContent/MainContent';
import { getClass } from '../../../../services/classService';
import { Descriptor } from '../../../../types/creation';
import { SrdFullClassItem, SrdItem } from '../../../../types/srd';
import styles from './Class.module.css';

type ClassProps = {
	classes: SrdItem[];
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

const Class = ({ classes }: ClassProps): JSX.Element => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [consideredClassIndex, setConsideredClassIndex] = useState<string>();
	const [consideredClass, setConsideredClass] = useState<SrdFullClassItem>();
	const [descriptors, setDescriptors] = useState<Descriptor[]>();
	const [showSelectModal, setShowSelectModal] = useState(false);

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
			const theDescriptors: Descriptor[] = consideredClass.class_levels
				.sort((a, b) => a.level - b.level)
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
					if (!acc.map(descriptor => descriptor.title).includes(cur.title)) {
						return [...acc, cur];
					} else {
						return acc;
					}
				}, []);

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
		setDescriptors(undefined);
		setConsideredClass(undefined);
		setConsideredClassIndex(undefined);
	}, [setConsideredClassIndex, setConsideredClass, setDescriptors]);

	const handleCancelSelectModal = useCallback(() => {
		deselectConsideredClass();
		setShowSelectModal(false);
	}, [deselectConsideredClass, setShowSelectModal]);

	const handleChooseSelectModal = useCallback(() => {
		deselectConsideredClass();
		setShowSelectModal(false);
	}, [deselectConsideredClass, setShowSelectModal]);

	return (
		<>
			<MainContent testId="class">
				<h1 className={styles.title}>Choose Class</h1>
				<ul className={styles['class-list']}>
					{classes.map(klass => (
						<Option
							key={klass.index}
							option={klass}
							onChoose={() => handleChooseClassOption(klass.index)}
						/>
					))}
				</ul>
			</MainContent>
			<ChooseModal
				iconId={consideredClassIndex as string}
				show={showSelectModal}
				onChoose={handleChooseSelectModal}
				onClose={handleCancelSelectModal}
				descriptors={descriptors}
				title={consideredClass?.name as string}
				error={error}
				loading={loading}
			/>
		</>
	);
};

export default Class;
