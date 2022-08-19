import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import {
	addFeatureSubfeature,
	removeFeatureSubfeature
} from '../../../../redux/features/classInfo';
import { SrdFeatureItem, SrdItem } from '../../../../types/srd';
import Button from '../../../Button/Button';
import classes from './FeatureChoiceSelector.module.css';

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

					return (
						<div
							key={sf.index}
							className={`${classes.subfeature}${
								isSelected ? ` ${classes.selected}` : ''
							}`}
						>
							<div className={classes['subfeature-label']}>{sf.name}</div>
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
									disabled={selectedSubfeatures.length >= choose}
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
