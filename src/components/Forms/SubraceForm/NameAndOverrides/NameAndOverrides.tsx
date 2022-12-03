import {
	EditingSubraceState,
	setName
} from '../../../../redux/features/editingSubrace';
import { FocusEventHandler, useCallback } from 'react';

import TextInput from '../../../TextInput/TextInput';
import classes from './NameAndOverrides.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';

type NameAndOverridesProps = {
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
};

const NameAndOverrides = ({
	shouldUseReduxStore,
	clickedSubmit
}: NameAndOverridesProps) => {
	const { values, errors, touched, handleChange, handleBlur } =
		useFormikContext<EditingSubraceState>();
	const dispatch = useAppDispatch();

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		event => {
			if (shouldUseReduxStore) {
				dispatch(setName(event.target.value));
			}

			handleBlur(event);
		},
		[handleBlur, shouldUseReduxStore, dispatch]
	);

	return (
		<div className={classes.container}>
			<div className={classes.name}>
				<TextInput
					id="name"
					label="Name"
					value={values.name}
					error={errors.name}
					touched={clickedSubmit || touched.name}
					onChange={handleChange}
					onBlur={handleNameBlur}
				/>
			</div>
		</div>
	);
};

export default NameAndOverrides;
