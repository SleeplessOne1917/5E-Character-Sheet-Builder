import { Formik, FormikHelpers } from 'formik';
import { FocusEventHandler, useCallback } from 'react';
import Button, { ButtonType } from '../../../components/Button/Button';
import MainContent from '../../../components/MainContent/MainContent';
import Select, { Option } from '../../../components/Select/Select';
import TextInput from '../../../components/TextInput/TextInput';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import {
	EditingSpellState,
	resetSpell,
	setLevel,
	setName
} from '../../../redux/features/editingSpell';
import spellSchema from '../../../yup-schemas/spellSchema';
import classes from './Spell.module.css';

const Spell = () => {
	const editingSpell = useAppSelector(state => state.editingSpell);
	const dispatch = useAppDispatch();

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		e => {
			dispatch(setName(e.target.value));
		},
		[dispatch]
	);

	const handleLevelChange = useCallback(
		(level: number | undefined) => {
			dispatch(setLevel(level));
		},
		[dispatch]
	);

	const handleFormikSubmit = useCallback(
		async (
			values: EditingSpellState,
			{ resetForm }: FormikHelpers<EditingSpellState>
		) => {
			resetForm();
			dispatch(resetSpell());
		},
		[dispatch]
	);

	return (
		<Formik
			initialValues={editingSpell}
			onSubmit={handleFormikSubmit}
			validationSchema={spellSchema}
			enableReinitialize
		>
			{({
				values,
				handleChange,
				handleBlur,
				handleSubmit,
				touched,
				errors,
				isSubmitting,
				setFieldValue
			}) => (
				<MainContent>
					<h1>Create Spell</h1>
					<form onSubmit={handleSubmit} className={classes.form}>
						<div className={classes['name-and-level']}>
							<TextInput
								id="name"
								label="Name"
								value={values.name}
								touched={touched.name}
								error={errors.name}
								onChange={handleChange}
								onBlur={event => {
									handleNameBlur(event);
									handleBlur(event);
								}}
							/>
							<div className={classes['level-container']}>
								<Select
									touched={touched.level}
									error={errors.level}
									options={[
										{ value: 'blank', label: '\u2014' } as Option
									].concat(
										[...Array(10).keys()].map(level => ({
											value: level,
											label: `${level === 0 ? 'Cantrip' : level}`
										}))
									)}
									onChange={value => {
										const newLevel =
											value === 'blank' ? undefined : (value as number);
										handleLevelChange(newLevel);
										setFieldValue('level', newLevel, true);
									}}
									value={values.level ?? 'blank'}
									id="level"
									label="Level"
								/>
							</div>
						</div>
						<Button
							positive
							type={ButtonType.submit}
							disabled={isSubmitting}
							style={{ marginTop: '3rem' }}
						>
							Create Spell
						</Button>
					</form>
				</MainContent>
			)}
		</Formik>
	);
};

export default Spell;
