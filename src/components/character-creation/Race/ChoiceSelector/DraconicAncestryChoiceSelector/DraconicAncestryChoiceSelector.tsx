import {
	SrdSubtraitItem,
	SrdSubtraitItemChoice
} from '../../../../../types/srd';
import { useCallback, useState } from 'react';

import ChoiceSelector from '../ChoiceSelector';
import Select from '../../../../Select/Select';

type OptionSelectorProps = {
	choice: SrdSubtraitItemChoice;
	onReset?: () => void;
	onApply?: (item: SrdSubtraitItem) => void;
	initialValue?: string;
};

const DraconicAncestryChoiceSelector = ({
	choice,
	onReset = () => {},
	onApply = () => {},
	initialValue
}: OptionSelectorProps): JSX.Element => {
	const [selectValue, setSelectValue] = useState<string>(
		initialValue ?? 'blank'
	);

	const handleChangeSelect = useCallback(
		(value: string) => setSelectValue(value),
		[setSelectValue]
	);

	const handleApply = useCallback(
		() =>
			onApply(
				choice.from.options
					.map(option => option.item)
					.find(({ index }) => index === selectValue) as SrdSubtraitItem
			),
		[onApply, choice, selectValue]
	);

	const handleReset = useCallback(() => {
		setSelectValue('blank');
		onReset();
	}, [setSelectValue, onReset]);

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
			selectValues={[selectValue]}
			selects={selects}
			isSelected={!!initialValue}
			onApply={handleApply}
			onReset={handleReset}
		/>
	);
};

export default DraconicAncestryChoiceSelector;
