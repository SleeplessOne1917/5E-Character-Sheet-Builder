import { ChangeEvent, useCallback, useState } from 'react';
import {
	SrdSubtraitItemChoice,
	SrdSubtraitItem
} from '../../../../../types/srd';

import ChoiceSelector from '../ChoiceSelector';
import classes from '../ChoiceSelector.module.css';

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
		(event: ChangeEvent<HTMLSelectElement>) =>
			setSelectValue(event.target.value),
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
		<select
			value={selectValue}
			aria-label="Select choice"
			onChange={handleChangeSelect}
			className={classes.select}
			key="draconic-ancestry"
		>
			<option value="blank">&mdash;</option>
			{choice.from.options.map(option => (
				<option value={option.item.index} key={option.item.index}>
					{
						(/Draconic Ancestry \((.*)\)/i.exec(option.item.name) ?? [
							'',
							''
						])[1]
					}
				</option>
			))}
		</select>
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
