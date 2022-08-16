import {
	CSSProperties,
	KeyboardEvent,
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';

import classes from './Select.module.css';
import { handleKeyDownEvent } from '../../services/handlerService';

type SelectProps = {
	options: { value: string | number; label: string }[];
	value?: string | number;
	onChange: (value: string | number) => void;
	testId?: string;
	labelledBy?: string;
};

const Select = ({
	options,
	value,
	onChange,
	testId,
	labelledBy
}: SelectProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const [listStyle, setListStyle] = useState<CSSProperties>({
		display: 'none'
	});
	const listItemRefs = useRef<HTMLLIElement[]>([]);
	const containerRef = useRef<HTMLDivElement>();
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

	const defaultIndex = value ? getValueIndex(value) : selectedIndex;

	const [focusIndex, setFocusIndex] = useState<number>(
		value ? getValueIndex(value) : selectedIndex
	);

	const closeSelect = useCallback(() => {
		setIsOpen(false);
		setFocusIndex(defaultIndex);
	}, [setIsOpen, setFocusIndex, defaultIndex]);

	useEffect(() => {
		const handleClickOutside = (event: Event) => {
			if (!containerRef.current?.contains(event.target as Node)) {
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
	}, [options]);

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
					setFocusIndex(defaultIndex);
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
		[setIsOpen, setFocusIndex, options, defaultIndex]
	);

	return (
		<div
			className={classes.container}
			ref={containerRef as MutableRefObject<HTMLDivElement>}
			data-testid={testId ?? 'select'}
			aria-labelledby={labelledBy}
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
				{options[defaultIndex].label}
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
				aria-activedescendant={options[defaultIndex].label}
				className={classes.list}
				onKeyDown={handleListKeyDown}
				data-testid={testId ? `${testId}-list` : 'select-list'}
			>
				{options.map((option, index) => (
					<li
						key={option.value}
						tabIndex={0}
						role="option"
						aria-selected={defaultIndex === index}
						className={`${classes.item}${
							defaultIndex === index ? ` ${classes.selected}` : ''
						}`}
						onClick={() => handleChange(option.value)}
						onKeyDown={event => handleItemKeyDown(event, option.value)}
						ref={element => {
							listItemRefs.current[index] = element as HTMLLIElement;
						}}
						data-testid={
							testId ? `${testId}-data-${option.value}` : `data-${option.value}`
						}
					>
						{option.label}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Select;
