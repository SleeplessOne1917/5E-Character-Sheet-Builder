import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import {
	useCallback,
	useState,
	KeyboardEvent,
	useRef,
	MutableRefObject,
	useEffect
} from 'react';
import { handleKeyDownEvent } from '../../services/handlerService';
import classes from './Select.module.css';

type SelectProps = {
	options: { value: string | number; label: string }[];
	value?: string | number;
	onChange: (value: string | number) => void;
};

const Select = ({ options, value, onChange }: SelectProps) => {
	const valueIndex = options
		.map(({ value }) => value)
		.indexOf(value as string | number);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(
		valueIndex > -1 ? valueIndex : 0
	);
	const [focusIndex, setFocusIndex] = useState<number>(selectedIndex);
	const listRefs = useRef<HTMLLIElement[]>([]);
	const containerRef = useRef<HTMLDivElement>();

	useEffect(() => {
		const handleClickOutside = (event: Event) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
				setFocusIndex(selectedIndex);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});

	useEffect(() => {
		listRefs.current = listRefs.current.slice(0, options.length);
	}, [options]);

	useEffect(() => {
		if (isOpen) {
			listRefs.current[focusIndex].focus();
		}
	}, [isOpen, focusIndex]);

	const handleChange = useCallback(
		(value: number | string, index: number) => {
			onChange(value);
			setSelectedIndex(index);
			setFocusIndex(selectedIndex);
			setIsOpen(false);
		},
		[onChange, setSelectedIndex, setIsOpen, setFocusIndex, selectedIndex]
	);

	const handleItemKeyDown = useCallback(
		(
			event: KeyboardEvent<HTMLLIElement>,
			value: number | string,
			index: number
		) => {
			handleKeyDownEvent(event, () => handleChange(value, index));
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
					setFocusIndex(selectedIndex);
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
		[setIsOpen, setFocusIndex, options, selectedIndex]
	);

	return (
		<div
			className={classes.container}
			ref={containerRef as MutableRefObject<HTMLDivElement>}
			data-testid="select"
		>
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				onClick={handleOpen}
				className={classes.button}
				onKeyDown={handleListKeyDown}
				data-testid="select-button"
			>
				{options[selectedIndex].label}
				{isOpen ? (
					<ChevronUpIcon className={classes.icon} />
				) : (
					<ChevronDownIcon className={classes.icon} />
				)}
			</button>
			<ul
				tabIndex={-1}
				style={{ display: isOpen ? 'block' : 'none' }}
				role="listbox"
				aria-activedescendant={options[selectedIndex].label}
				className={classes.list}
				onKeyDown={handleListKeyDown}
				data-testid="select-list"
			>
				{options.map((option, index) => (
					<li
						key={option.value}
						tabIndex={0}
						role="option"
						aria-selected={selectedIndex === index}
						className={`${classes.item}${
							selectedIndex === index ? ` ${classes.selected}` : ''
						}`}
						onClick={() => handleChange(option.value, index)}
						onKeyDown={event => handleItemKeyDown(event, option.value, index)}
						ref={element => {
							listRefs.current[index] = element as HTMLLIElement;
						}}
					>
						{option.label}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Select;
