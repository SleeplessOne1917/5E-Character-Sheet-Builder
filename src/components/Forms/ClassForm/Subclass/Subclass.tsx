'use client';

import { useFormikContext } from 'formik';
import { FocusEventHandler, useCallback } from 'react';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import {
	EditingClassState,
	setSubclassFlavor
} from '../../../../redux/features/editingClass';
import TextInput from '../../../TextInput/TextInput';
import styles from './Subclass.module.css';

type SubclassProps = {
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
};

const Subclass = ({ shouldUseReduxStore, clickedSubmit }: SubclassProps) => {
	const { values, handleChange, handleBlur, touched, errors } =
		useFormikContext<EditingClassState>();
	const dispatch = useAppDispatch();

	const handleFlavorBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		event => {
			console.log(errors);
			if (shouldUseReduxStore) {
				dispatch(setSubclassFlavor(event.target.value));
			}

			handleBlur(event);
		},
		[shouldUseReduxStore, dispatch, handleBlur, errors]
	);

	return (
		<section className={styles.container}>
			<h2>Subclass Info</h2>
			{clickedSubmit && errors.subclassLevels && (
				<div className={styles['error-message']}>{errors.subclassLevels}</div>
			)}
			<TextInput
				id="subclassFlavor"
				label="Subclass Flavor"
				touched={clickedSubmit || touched.subclassFlavor}
				error={errors.subclassFlavor}
				onChange={handleChange}
				onBlur={handleFlavorBlur}
				value={values.subclassFlavor}
			/>
		</section>
	);
};

export default Subclass;
