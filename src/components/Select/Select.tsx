import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import {
	useCallback,
	useState,
	KeyboardEvent,
	useRef,
	MutableRefObject,
	useEffect,
	CSSProperties
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
	const [focusIndex, setFocusIndex] = useState<number>(valueIndex);
	const [listStyle, setListStyle] = useState<CSSProperties>({
		display: 'none'
	});
	const listRefs = useRef<HTMLLIElement[]>([]);
	const containerRef = useRef<HTMLDivElement>();
	const buttonRef = useRef<HTMLButtonElement>();

	const closeSelect = useCallback(() => {
		setIsOpen(false);
		setFocusIndex(valueIndex);
	}, [setIsOpen, setFocusIndex, valueIndex]);

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
		listRefs.current = listRefs.current.slice(0, options.length);
	}, [options]);

	useEffect(() => {
		if (isOpen) {
			listRefs.current[focusIndex].focus();
			setListStyle({
				display: 'block',
				top: buttonRef.current?.offsetHeight
			});
		} else {
			setListStyle({ display: 'none' });
		}
	}, [isOpen, focusIndex, setListStyle]);

	const handleChange = useCallback(
		(value: number | string) => {
			onChange(value);
			closeSelect();
		},
		[onChange, closeSelect]
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
					setFocusIndex(valueIndex);
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
		[setIsOpen, setFocusIndex, options, valueIndex]
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
				ref={buttonRef as MutableRefObject<HTMLButtonElement>}
			>
				{options[valueIndex].label}
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
				aria-activedescendant={options[valueIndex].label}
				className={classes.list}
				onKeyDown={handleListKeyDown}
				data-testid="select-list"
			>
				{options.map((option, index) => (
					<li
						key={option.value}
						tabIndex={0}
						role="option"
						aria-selected={valueIndex === index}
						className={`${classes.item}${
							valueIndex === index ? ` ${classes.selected}` : ''
						}`}
						onClick={() => handleChange(option.value)}
						onKeyDown={event => handleItemKeyDown(event, option.value)}
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
