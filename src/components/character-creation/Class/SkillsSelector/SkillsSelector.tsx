import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import { setSelectedSkills } from '../../../../redux/features/classInfo';
import {
	addProficiency,
	removeProficiency
} from '../../../../redux/features/proficiencies';
import { SrdProficiencyItem } from '../../../../types/srd';
import Select from '../../../Select/Select';
import classes from './SkillsSelector.module.css';

type SkillSelectorProps = {
	skills: SrdProficiencyItem[];
};

const SkillsSelector = ({ skills }: SkillSelectorProps) => {
	const dispatch = useAppDispatch();

	const proficiencies = useAppSelector(
		state => state.editingCharacter.proficiencies
	);

	const selectedSkills = useAppSelector(
		state => state.editingCharacter.classInfo.selectedSkills
	);

	const handleChange = useCallback(
		(index: number, value: SrdProficiencyItem | null) => {
			if (value) {
				dispatch(addProficiency(value));
			} else if (selectedSkills[index]) {
				dispatch(removeProficiency(selectedSkills[index]?.index as string));
			}

			dispatch(
				setSelectedSkills([
					...selectedSkills.slice(0, index),
					value,
					...selectedSkills.slice(index + 1)
				])
			);
		},
		[dispatch, selectedSkills]
	);

	return (
		<div data-testid="skills-selector" className={classes.container}>
			<h2 className={classes.heading}>Skills</h2>
			<div className={classes['selected-text']}>
				{selectedSkills.filter(skill => skill).length}/{selectedSkills.length}{' '}
				Skills Selected
			</div>
			<div className={classes['skills-container']}>
				{selectedSkills.map((skill, index) => (
					<div
						key={index}
						className={`${classes['skill-container']}${
							skill ? ` ${classes.selected}` : ''
						}`}
					>
						<label id="select-skill" className={classes.label}>
							Select Skill
						</label>
						<Select
							labelledBy="select-skill"
							options={[{ value: 'blank', label: '\u2014' }].concat(
								skills
									.filter(
										skill =>
											!(
												selectedSkills.some(s => s?.index === skill.index) ||
												proficiencies.some(p => p.index === skill.index)
											) || skill.index === selectedSkills[index]?.index
									)
									.map(skill => ({
										value: skill.index,
										label: skill.name.replace(/.*:\s*/, '')
									}))
							)}
							value={skill ? skill.index : 'blank'}
							onChange={value =>
								handleChange(
									index,
									value !== 'blank'
										? (skills.find(
												skill => skill.index === (value as string)
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

export default SkillsSelector;
