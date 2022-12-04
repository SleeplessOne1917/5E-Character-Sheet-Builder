import {
	EditingSubraceState,
	addOmittedRaceTrait,
	removeOmittedRaceTrait
} from '../../../../../redux/features/editingSubrace';
import { useCallback, useMemo, useState } from 'react';

import Button from '../../../../Button/Button';
import Trait from '../../../../../types/trait';
import TraitModal from '../../../TraitModal/TraitModal';
import classes from './IncludeOmitItem.module.css';
import { useAppDispatch } from '../../../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';

type IncludeOmitItemProps = {
	trait: Pick<Trait, 'description' | 'name' | 'uuid'>;
	mode: 'include' | 'omit';
	shouldUseReduxStore: boolean;
};

const IncludeOmitItem = ({
	trait,
	mode,
	shouldUseReduxStore
}: IncludeOmitItemProps) => {
	const { setFieldValue, values } = useFormikContext<EditingSubraceState>();
	const [showModal, setShowModal] = useState(false);
	const dispatch = useAppDispatch();

	const handleOmit = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(addOmittedRaceTrait(trait.uuid));
		}

		setShowModal(false);

		setFieldValue(
			'omittedRaceTraits',
			[...(values.omittedRaceTraits ?? []), trait.uuid],
			false
		);
	}, [
		shouldUseReduxStore,
		setFieldValue,
		values.omittedRaceTraits,
		trait.uuid,
		dispatch
	]);

	const handleInclude = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(removeOmittedRaceTrait(trait.uuid));
		}

		setShowModal(false);

		setFieldValue(
			'omittedRaceTraits',
			values.omittedRaceTraits?.filter(t => t !== trait.uuid),
			false
		);
	}, [
		shouldUseReduxStore,
		setFieldValue,
		values.omittedRaceTraits,
		trait.uuid,
		dispatch
	]);

	const handleShowModal = useCallback(() => {
		setShowModal(true);
	}, []);

	const handleClodeModal = useCallback(() => {
		setShowModal(false);
	}, []);

	const handleAction = useMemo(
		() => (mode === 'include' ? handleInclude : handleOmit),
		[mode, handleInclude, handleOmit]
	);

	return (
		<>
			<div className={classes.item}>
				<div className={classes.title}>{trait.name}</div>
				<div className={classes.buttons}>
					<Button positive onClick={handleAction} size="small">
						{mode === 'include' ? 'Include' : 'Omit'}
					</Button>
					<Button positive onClick={handleShowModal} size="small">
						More Info
					</Button>
				</div>
			</div>
			<TraitModal
				show={showModal}
				mode={mode}
				trait={trait}
				onAction={handleAction}
				onClose={handleClodeModal}
			/>
		</>
	);
};

export default IncludeOmitItem;
