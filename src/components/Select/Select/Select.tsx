'use client';

import {
	CSSProperties,
	KeyboardEvent,
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

import Option from '../Option';
import classes from '../Select.module.css';
import { handleKeyDownEvent } from '../../../services/handlerService';

type SelectProps = {
	options: Option[];
	value?: string | number;
	onChange: (value: string | number) => void;
	testId?: string;
	fontSize?: string;
	touched?: boolean;
	error?: string;
	id?: string;
	label?: string;
	labelFontSize?: string;
	errorFontSize?: string;
	hideLabel?: boolean;
};

const Select = ({
	options,
	value,
	onChange,
	testId,
	fontSize,
	touched,
	error,
	id = 'select',
	label,
	labelFontSize = '1.5rem',
	errorFontSize = '1.5rem',
	hideLabel = false
}: SelectProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const [listStyle, setListStyle] = useState<CSSProperties>({
		display: 'none'
	});
	const listItemRefs = useRef<HTMLLIElement[]>([]);
	const listBoxContainerRef = useRef<HTMLDivElement>();
	const buttonRef = useRef<HTMLButtonElement>();
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	const getValueIndex = useCallback(
		(value: string | number) => {
			const valueIndex = options
				.map(({ value }) => value)
				.indexOf(value as string | number);

			return valueIndex >= 0 ? valueIndex : selectedIndex;
		},
		[options, selectedIndex]
	);

	const getDefaultIndex = useCallback(
		() => (value !== undefined ? getValueIndex(value) : selectedIndex),
		[value, getValueIndex, selectedIndex]
	);

	const [focusIndex, setFocusIndex] = useState<number>(getDefaultIndex());

	const closeSelect = useCallback(() => {
		setIsOpen(false);
		setFocusIndex(getDefaultIndex());
	}, [setIsOpen, setFocusIndex, getDefaultIndex]);

	useEffect(() => {
		const handleClickOutside = (event: Event) => {
			if (!listBoxContainerRef.current?.contains(event.target as Node)) {
				closeSelect();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [closeSelect]);

	useEffect(() => {
		listItemRefs.current = listItemRefs.current.slice(0, options.length);
		if (value || value === 0) {
			setFocusIndex(getDefaultIndex());
		}
	}, [options, value, getDefaultIndex]);

	useEffect(() => {
		if (isOpen) {
			listItemRefs.current[focusIndex].focus();
			if (
				window.innerHeight -
					(buttonRef.current?.getBoundingClientRect().y ?? 0) <
				window.innerHeight / 2
			) {
				setListStyle({
					display: 'block',
					bottom: buttonRef.current?.offsetHeight
				});
			} else {
				setListStyle({
					display: 'block',
					top: buttonRef.current?.offsetHeight
				});
			}
		} else {
			setListStyle({ display: 'none' });
		}
	}, [isOpen, focusIndex, setListStyle]);

	const handleChange = useCallback(
		(changeValue: number | string) => {
			onChange(changeValue);
			setFocusIndex(getValueIndex(changeValue));
			setSelectedIndex(getValueIndex(changeValue));
			closeSelect();
		},
		[onChange, closeSelect, setFocusIndex, setSelectedIndex, getValueIndex]
	);

	const handleItemKeyDown = useCallback(
		(event: KeyboardEvent<HTMLLIElement>, value: number | string) => {
			handleKeyDownEvent(event, () => handleChange(value));
		},
		[handleChange]
	);

	const handleOpen = useCallback(() => {
		setIsOpen(prev => !prev);
	}, [setIsOpen]);

	const handleListKeyDown = useCallback(
		(e: KeyboardEvent) => {
			switch (e.code) {
				case 'Escape':
					e.preventDefault();
					setFocusIndex(getDefaultIndex());
					setIsOpen(false);
					break;
				case 'ArrowUp':
					e.preventDefault();
					setFocusIndex(prevState =>
						prevState - 1 >= 0 ? prevState - 1 : options.length - 1
					);
					break;
				case 'ArrowDown':
					e.preventDefault();
					setFocusIndex(prevState =>
						prevState == options.length - 1 ? 0 : prevState + 1
					);
					break;
				default:
					break;
			}
		},
		[setIsOpen, setFocusIndex, options, getDefaultIndex]
	);

	return (
		<div
			data-testid={testId ?? 'select'}
			className={classes['list-box-and-error-container']}
		>
			{label && !hideLabel && (
				<label id={`${id}-label`} style={{ fontSize: labelFontSize }}>
					{label}
				</label>
			)}
			<div
				className={`${classes['list-box-container']}${
					touched && error ? ` ${classes.error}` : ''
				}`}
				ref={listBoxContainerRef as MutableRefObject<HTMLDivElement>}
				aria-labelledby={`${id}-label`}
				aria-label={label}
				style={{ fontSize: fontSize ? fontSize : '1.2rem' }}
			>
				<button
					type="button"
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					onClick={handleOpen}
					className={classes.button}
					onKeyDown={handleListKeyDown}
					ref={buttonRef as MutableRefObject<HTMLButtonElement>}
					data-testid={testId ? `${testId}-button` : 'select-button'}
				>
					{options[getDefaultIndex()].label}
					{isOpen ? (
						<ChevronUpIcon className={classes.icon} />
					) : (
						<ChevronDownIcon className={classes.icon} />
					)}
				</button>
				<ul
					tabIndex={-1}
					style={listStyle}
					role="listbox"
					aria-activedescendant={options[getDefaultIndex()].label}
					className={classes.list}
					onKeyDown={handleListKeyDown}
					data-testid={testId ? `${testId}-list` : 'select-list'}
				>
					{options.map((option, index) => (
						<li
							key={option.value}
							tabIndex={0}
							role="option"
							aria-selected={getDefaultIndex() === index}
							className={`${classes.item}${
								getDefaultIndex() === index ? ` ${classes.selected}` : ''
							}`}
							onClick={() => handleChange(option.value)}
							onKeyDown={event => handleItemKeyDown(event, option.value)}
							ref={element => {
								if (listItemRefs.current.length >= index + 1) {
									listItemRefs.current[index] = element as HTMLLIElement;
								} else {
									listItemRefs.current.push(element as HTMLLIElement);
								}
							}}
							data-testid={
								testId
									? `${testId}-data-${option.value}`
									: `data-${option.value}`
							}
						>
							{option.label}
						</li>
					))}
				</ul>
			</div>
			{touched && error && (
				<div
					className={classes['error-message']}
					style={{ fontSize: errorFontSize }}
				>
					{error}
				</div>
			)}
		</div>
	);
};

export default Select;
