import {
	SrdSubtraitItem,
	SrdSubtraitItemChoice
} from '../../../../../types/srd';
import {
	deselectDraconicAncestry,
	selectDraconicAncestry
} from '../../../../../redux/features/raceInfo';
import {
	useAppDispatch,
	useAppSelector
} from '../../../../../hooks/reduxHooks';

import ChoiceSelector from '../ChoiceSelector';
import Select from '../../../../Select/Select/Select';
import { useCallback } from 'react';

type OptionSelectorProps = {
	choice: SrdSubtraitItemChoice;
};

const DraconicAncestryChoiceSelector = ({
	choice
}: OptionSelectorProps): JSX.Element => {
	const selectValue =
		useAppSelector(
			state => state.editingCharacter.raceInfo.draconicAncestry?.index
		) ?? 'blank';
	const dispatch = useAppDispatch();

	const handleChangeSelect = useCallback(
		(value: string) => {
			if (value === 'blank') {
				dispatch(deselectDraconicAncestry());
			} else {
				dispatch(
					selectDraconicAncestry(
						choice.from.options
							.map(option => option.item)
							.find(({ index }) => index === value) as SrdSubtraitItem
					)
				);
			}
		},
		[dispatch, choice]
	);

	const handleReset = useCallback(() => {
		dispatch(deselectDraconicAncestry());
	}, [dispatch]);

	const selects = [
		<Select
			value={selectValue}
			key="draconic-ancestry"
			onChange={value => handleChangeSelect(value as string)}
			options={[{ value: 'blank', label: '\u2014' }].concat(
				choice.from.options.map(option => ({
					value: option.item.index,
					label: (/Draconic Ancestry \((.*)\)/i.exec(option.item.name) ?? [
						'',
						''
					])[1]
				}))
			)}
		/>
	];

	return (
		<ChoiceSelector
			label="Select draconic ancestry"
			selects={selects}
			isSelected={selectValue !== 'blank'}
			onReset={handleReset}
		/>
	);
};

export default DraconicAncestryChoiceSelector;
