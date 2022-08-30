import {
	ChangeEventHandler,
	FocusEventHandler,
	useCallback,
	useState
} from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';

import TextInput from '../../TextInput/TextInput';
import classes from './GeneralInfoBar.module.css';
import { setName } from '../../../redux/features/name';

const GeneralInfoBar = () => {
	const characterName = useAppSelector(state => state.editingCharacter.name);
	const dispatch = useAppDispatch();
	const [editingName, setEditingName] = useState(characterName);

	const handleNameChange: ChangeEventHandler<HTMLInputElement> = useCallback(
		e => {
			setEditingName(e.target.value);
		},
		[setEditingName]
	);

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		e => {
			const newName = e.target.value.slice(0, 20);
			dispatch(setName(newName));
			setEditingName(newName);
		},
		[dispatch, setEditingName]
	);

	return (
		<section className={classes.container}>
			<div className={classes['name-container']}>
				<TextInput
					id="characterName"
					label="Character Name"
					value={editingName}
					onBlur={handleNameBlur}
					onChange={handleNameChange}
					darkBackground
				/>
			</div>
		</section>
	);
};

export default GeneralInfoBar;
