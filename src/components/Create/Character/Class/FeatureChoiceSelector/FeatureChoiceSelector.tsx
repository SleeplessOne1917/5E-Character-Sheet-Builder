import { SrdFeatureItem, SrdItem } from '../../../../../types/srd';
import {
	addFeatureSubfeature,
	removeFeatureSubfeature
} from '../../../../../redux/features/classInfo';
import {
	useAppDispatch,
	useAppSelector
} from '../../../../../hooks/reduxHooks';

import Button from '../../../../Button/Button';
import classes from './FeatureChoiceSelector.module.css';
import { getOrdinal } from '../../../../../services/ordinalService';
import { useCallback } from 'react';

type FeatureChoiceSelectorProps = {
	feature: SrdItem;
	choose: number;
	subfeatures: SrdFeatureItem[];
};

const FeatureChoiceSelector = ({
	feature,
	choose,
	subfeatures
}: FeatureChoiceSelectorProps) => {
	const selectedSubfeatures =
		useAppSelector(
			state =>
				state.editingCharacter.classInfo.featuresSubfeatures[feature.index]
		) ?? [];
	const dispatch = useAppDispatch();

	const classInfo = useAppSelector(state => state.editingCharacter.classInfo);

	const spells = useAppSelector(
		state => state.editingCharacter.spellcasting.spells
	);

	const allFeatures = classInfo.class?.class_levels
		.filter(level => !level.subclass && level.level >= classInfo.level)
		.flatMap(level => level.features)
		.concat(
			Object.values(classInfo.featuresSubfeatures).flatMap(value => value)
		);

	const handleSelect = useCallback(
		(subfeature: SrdFeatureItem) => {
			dispatch(
				addFeatureSubfeature({ index: feature.index, feature: subfeature })
			);
		},
		[dispatch, feature.index]
	);

	const handleDeselect = useCallback(
		(subfeature: string) => {
			dispatch(
				removeFeatureSubfeature({ index: feature.index, feature: subfeature })
			);
		},
		[dispatch, feature.index]
	);

	return (
		<div data-testid="feature-choice-selector" className={classes.container}>
			<h2 className={classes.header}>{feature.name}</h2>
			<div className={classes['selected-text']}>
				{selectedSubfeatures.length}/{choose} selected
			</div>
			<div className={classes.subfeatures}>
				{subfeatures.map(sf => {
					const isSelected = selectedSubfeatures.some(
						subfeature => subfeature.index === sf.index
					);

					const meetsPrerequisites = sf.prerequisites.reduce<boolean>(
						(acc, cur) => {
							if (cur.feature) {
								return !!allFeatures?.some(f => f.index === cur.feature?.index);
							} else if (cur.spell) {
								return spells.some(spell => spell.index === cur.spell?.index);
							} else if (cur.level) {
								return classInfo.level >= cur.level;
							} else {
								return acc;
							}
						},
						true
					);

					return (
						<div
							key={sf.index}
							className={`${classes.subfeature}${
								isSelected ? ` ${classes.selected}` : ''
							}`}
						>
							<div className={classes['subfeature-label']}>{sf.name}</div>
							{sf.prerequisites.length > 0 && (
								<div className={classes.prerequisites}>
									Prerequisites:{' '}
									{sf.prerequisites
										.map(prereq => {
											if (prereq.feature) {
												return prereq.feature.name;
											} else if (prereq.spell) {
												return prereq.spell.name;
											} else {
												return `${getOrdinal(prereq.level ?? 1)} level`;
											}
										})
										.join(', ')}
								</div>
							)}
							<div className={classes['subfeature-description']}>
								{sf.desc.map((d, i) => (
									<p key={i}>{d}</p>
								))}
							</div>
							{isSelected ? (
								<Button
									style={{ alignSelf: 'center' }}
									onClick={() => handleDeselect(sf.index)}
								>
									Deselect
								</Button>
							) : (
								<Button
									positive
									style={{ alignSelf: 'center' }}
									disabled={
										selectedSubfeatures.length >= choose || !meetsPrerequisites
									}
									onClick={() => handleSelect(sf)}
								>
									Select
								</Button>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default FeatureChoiceSelector;
