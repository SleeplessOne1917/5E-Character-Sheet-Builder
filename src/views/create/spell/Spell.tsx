import { Formik, FormikHelpers } from 'formik';
import { FocusEventHandler, useCallback } from 'react';
import Button, { ButtonType } from '../../../components/Button/Button';
import MainContent from '../../../components/MainContent/MainContent';
import TextInput from '../../../components/TextInput/TextInput';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import {
	EditingSpellState,
	resetSpell,
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
				isSubmitting
			}) => (
				<MainContent>
					<h1>Create Spell</h1>
					<form onSubmit={handleSubmit} className={classes.form}>
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
						<Button positive type={ButtonType.submit} disabled={isSubmitting}>
							Create Spell
						</Button>
					</form>
				</MainContent>
			)}
		</Formik>
	);
};

export default Spell;
