import {
	ChangeEvent,
	ChangeEventHandler,
	FocusEvent,
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';

import Button from '../Button/Button';
import MarkdownParser from '../MarkdownParser/MarkdownParser';
import classes from './MarkdownTextArea.module.css';
import { convertRemToPixels } from '../../services/remToPixelsService';

type MarkdownTextAreaProps = {
	value?: string;
	onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
	touched?: boolean;
	error?: string;
	id?: string;
	label?: string;
};

const calculateNumberOfRows = (content: string, cols: number) => {
	return Math.max(
		content.split(/(\n)/g).reduce<{ value: number; hasNewline: boolean }>(
			(acc, cur) => {
				if (cur === '\n') {
					if (acc.hasNewline) {
						return {
							...acc,
							value: acc.value + 1
						};
					} else {
						return {
							hasNewline: true,
							value: acc.value + 2
						};
					}
				} else {
					return {
						...acc,
						value:
							acc.value +
							(cur.length > 0 ? Math.max(Math.floor(cur.length / cols), 1) : 0)
					};
				}
			},
			{ value: 0, hasNewline: false }
		).value,
		5
	);
};

const MarkdownTextArea = ({
	value,
	onBlur = () => {},
	onChange = () => {},
	touched = false,
	error,
	id,
	label
}: MarkdownTextAreaProps) => {
	const [content, setContent] = useState(value ?? '');
	const [numberOfRows, setNumberOfRows] = useState(5);
	const [numberOfCols, setNumberOfCols] = useState(20);
	const [isPreview, setIsPreview] = useState(false);

	const textAreaRef = useRef<HTMLTextAreaElement>();

	useEffect(() => {
		const setColsAndRows = () => {
			const newColumnsNumber = Math.floor(
				(textAreaRef.current?.offsetWidth ?? 100) /
					(convertRemToPixels(1.2) / 1.85)
			);
			setNumberOfCols(newColumnsNumber);
			setNumberOfRows(calculateNumberOfRows(content, newColumnsNumber));
		};

		setColsAndRows();

		window.addEventListener('resize', setColsAndRows);

		return () => {
			window.removeEventListener('resize', setColsAndRows);
		};
	}, [content]);

	const handleTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> =
		useCallback(
			event => {
				onChange(event);
				setContent(event.target.value);

				setNumberOfRows(
					calculateNumberOfRows(
						event.target.value,
						textAreaRef.current?.cols ?? 20
					)
				);
			},
			[onChange]
		);

	return (
		<div className={classes.container} data-testid="markdown-text-area">
			<div className={classes['header']}>
				<label className={classes.label} htmlFor={id}>
					{label}
				</label>
				<Button
					positive
					style={{ justifySelf: 'flex-end' }}
					onClick={() => setIsPreview(prev => !prev)}
				>
					{isPreview ? 'Edit' : 'Preview'}
				</Button>
			</div>
			{isPreview ? (
				<div className={classes['markdown-container']} id={id}>
					<MarkdownParser input={content} />
				</div>
			) : (
				<textarea
					onChange={handleTextAreaChange}
					className={`${classes['text-input']}${
						error && touched ? ` ${classes.error}` : ''
					}`}
					ref={textAreaRef as MutableRefObject<HTMLTextAreaElement>}
					rows={numberOfRows}
					cols={numberOfCols}
					onBlur={onBlur}
					id={id}
					value={content}
				></textarea>
			)}
			{error && touched && (
				<div className={classes['error-message']}>{error}</div>
			)}
		</div>
	);
};

export default MarkdownTextArea;
