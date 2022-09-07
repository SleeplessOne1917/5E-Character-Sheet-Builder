import classes from './MultiSelect.module.css';
import selectClasses from '../Select.module.css';
import { useCallback, useRef, useState, KeyboardEvent } from 'react';
import Option from '../Option';
import { handleKeyDownEvent } from '../../../services/handlerService';

type MultiSelectProps = {
	id?: string;
	label?: string;
	labelFontSize?: string;
	touched?: boolean;
	error?: string;
	fontSize?: string;
	options: Option[];
	values: (string | number)[];
	onSelect: (values: (string | number)[]) => void;
};

const MultiSelect = ({
	id,
	label,
	labelFontSize = '1.5rem',
	touched,
	error,
	fontSize,
	options,
	values,
	onSelect
}: MultiSelectProps) => {
	const [selectedValues, setSelectedValues] = useState(values ?? []);
	const [focusIndex, setFocusIndex] = useState(0);

	const listItemRefs = useRef<HTMLLIElement[]>([]);

	const handleListKeyDown = useCallback(
		(e: KeyboardEvent) => {
			switch (e.code) {
				case 'ArrowUp':
					e.preventDefault();
					if (focusIndex > 0) {
						setFocusIndex(prev => {
							const returnVal = prev - 1;
							listItemRefs.current[returnVal].focus();
							return returnVal;
						});
					}
					break;
				case 'ArrowDown':
					e.preventDefault();
					if (focusIndex < listItemRefs.current.length - 1) {
						setFocusIndex(prev => {
							const returnVal = prev + 1;
							listItemRefs.current[returnVal].focus();
							return returnVal;
						});
					}
					break;
				default:
					break;
			}
		},
		[focusIndex]
	);
	const handleChange = useCallback(
		(changeValue: number | string) => {
			setSelectedValues(prev => {
				const returnValues = prev.includes(changeValue)
					? prev.filter(val => val !== changeValue)
					: [...prev, changeValue];

				onSelect(returnValues);

				return returnValues;
			});
		},
		[onSelect, setSelectedValues]
	);

	const handleItemKeyDown = useCallback(
		(event: KeyboardEvent<HTMLLIElement>, value: number | string) => {
			handleKeyDownEvent(event, () => handleChange(value));
		},
		[handleChange]
	);

	const handleFocus = useCallback((index: number) => {
		setFocusIndex(index);
	}, []);

	return (
		<div
			data-testid={'multi-select'}
			className={selectClasses['list-box-and-error-container']}
		>
			{label && id && (
				<label id={`${id}-label`} style={{ fontSize: labelFontSize }}>
					{label}
				</label>
			)}
			<div
				className={`${classes['list-box-container']}${
					touched && error ? ` ${classes.error}` : ''
				}`}
				style={{ fontSize: fontSize ? fontSize : '1.2rem' }}
			>
				<ul
					tabIndex={-1}
					role="listbox"
					aria-labelledby={`${id}-label`}
					aria-multiselectable="true"
					className={classes.list}
					onKeyDown={handleListKeyDown}
					data-testid="multi-select-list"
				>
					{options.map((option, index) => (
						<li
							key={option.value}
							tabIndex={0}
							role="option"
							aria-selected={selectedValues.includes(option.value)}
							className={`${classes.item}${
								selectedValues.includes(option.value)
									? ` ${classes.selected}`
									: ''
							}`}
							onClick={() => handleChange(option.value)}
							onKeyDown={event => handleItemKeyDown(event, option.value)}
							ref={element => {
								listItemRefs.current[index] = element as HTMLLIElement;
							}}
							data-testid={`data-${option.value}`}
							onFocus={() => handleFocus(index)}
						>
							{option.label}
						</li>
					))}
				</ul>
			</div>
			{touched && error && (
				<div className={selectClasses['error-message']}>{error}</div>
			)}
		</div>
	);
};

export default MultiSelect;
