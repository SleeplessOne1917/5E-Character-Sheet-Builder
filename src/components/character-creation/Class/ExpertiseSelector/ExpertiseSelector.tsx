import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import { setExpertiseProficiency } from '../../../../redux/features/classInfo';
import { SrdProficiencyItem } from '../../../../types/srd';
import Select from '../../../Select/Select/Select';
import classes from './ExpertiseSelector.module.css';

const ExpertiseSelector = () => {
	const proficiencies = useAppSelector(
		state => state.editingCharacter.proficiencies
	).filter(prof => prof.type === 'SKILLS' || prof.index === 'thieves-tools');

	const selectedExpertiseProficiencies =
		useAppSelector(
			state => state.editingCharacter.classInfo.expertiseProficiencies
		) ?? [];

	const dispatch = useAppDispatch();

	const handleChange = useCallback(
		(index: number, value: SrdProficiencyItem | null) => {
			dispatch(setExpertiseProficiency({ index, proficiency: value }));
		},
		[dispatch]
	);

	return (
		<div data-testid="expertise-selector" className={classes.container}>
			<h2 className={classes.heading}>Expertise</h2>
			<div className={classes['selected-text']}>
				{selectedExpertiseProficiencies.filter(prof => prof).length}/
				{selectedExpertiseProficiencies.length} Proficiencies Selected
			</div>
			<div className={classes['proficiencies-container']}>
				{selectedExpertiseProficiencies.map((prof, index) => (
					<div
						key={index}
						className={`${classes['proficiency-container']}${
							prof ? ` ${classes.selected}` : ''
						}`}
					>
						<Select
							fontSize="1.3rem"
							id="select-proficiency"
							label="Select Proficiency"
							options={[{ value: 'blank', label: '\u2014' }].concat(
								proficiencies
									.filter(
										prof =>
											!selectedExpertiseProficiencies.some(
												s => s?.index === prof.index
											) ||
											prof.index ===
												selectedExpertiseProficiencies[index]?.index
									)
									.map(prof => ({
										value: prof.index,
										label: prof.name.replace(/.*:\s*/, '')
									}))
							)}
							value={prof ? prof.index : 'blank'}
							onChange={value =>
								handleChange(
									index,
									value !== 'blank'
										? (proficiencies.find(
												p => p.index === (value as string)
										  ) as SrdProficiencyItem)
										: null
								)
							}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default ExpertiseSelector;
