import {
	ChangeEventHandler,
	FocusEvent,
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';

import Button from '../Button/Button';
import { LinkIcon } from '@heroicons/react/20/solid';
import MarkdownParser from '../MarkdownParser/MarkdownParser';
import classes from './MarkdownTextArea.module.css';
import { convertRemToPixels } from '../../services/remToPixelsService';

type MarkdownTextAreaProps = {
	value?: string;
	onChange?: (value: string) => void;
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
	const [changed, setChanged] =
		useState<'bold' | 'italic' | 'header' | 'quote' | 'link' | null>();
	const [shouldFocus, setShouldFocus] = useState(false);

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
				onChange(event.target.value);
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

	const handleTextAreaBlur = useCallback(
		(event: FocusEvent<HTMLTextAreaElement>) => {
			onBlur(event);
			if (
				event.relatedTarget?.tagName.toLowerCase() === 'button' &&
				event.relatedTarget?.innerHTML !== 'B' &&
				event.relatedTarget?.innerHTML !== 'I' &&
				event.relatedTarget?.innerHTML !== 'H' &&
				event.relatedTarget?.innerHTML !== 'Q' &&
				!event.relatedTarget?.innerHTML.startsWith('<svg')
			) {
				textAreaRef.current?.setSelectionRange(-1, -1);
			}
		},
		[onBlur]
	);

	const handleBoldClick = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (selectionStart && selectionEnd && selectionStart !== selectionEnd) {
			setContent(
				prevContent =>
					prevContent.substring(0, selectionStart) +
					'**' +
					prevContent.substring(selectionStart, selectionEnd) +
					'**' +
					prevContent.substring(selectionEnd, prevContent.length)
			);
		} else if (
			selectionStart &&
			selectionEnd &&
			selectionStart === selectionEnd &&
			selectionStart < content.length
		) {
			const start = content.substring(0, selectionStart).lastIndexOf(' ') + 1;
			let end = content.indexOf(' ', selectionEnd);

			if (end === -1) {
				end = content.length;
			}

			setContent(
				prevContent =>
					prevContent.substring(0, start) +
					'**' +
					prevContent.substring(start, end) +
					'**' +
					prevContent.substring(end, prevContent.length)
			);
		} else {
			setContent(prevContent => prevContent + '****');
			setShouldFocus(true);
		}

		setChanged('bold');
	}, [content]);

	const handleItalicClick = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (selectionStart && selectionEnd && selectionStart !== selectionEnd) {
			setContent(
				prevContent =>
					prevContent.substring(0, selectionStart) +
					'*' +
					prevContent.substring(selectionStart, selectionEnd) +
					'*' +
					prevContent.substring(selectionEnd, prevContent.length)
			);
		} else if (
			selectionStart &&
			selectionEnd &&
			selectionStart === selectionEnd &&
			selectionStart < content.length
		) {
			const start = content.substring(0, selectionStart).lastIndexOf(' ') + 1;
			let end = content.indexOf(' ', selectionEnd);

			if (end === -1) {
				end = content.length;
			}

			setContent(
				prevContent =>
					prevContent.substring(0, start) +
					'*' +
					prevContent.substring(start, end) +
					'*' +
					prevContent.substring(end, prevContent.length)
			);
		} else {
			setContent(prevContent => prevContent + '**');
			setShouldFocus(true);
		}

		setChanged('italic');
	}, [content]);

	const handleHeaderClick = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (selectionStart && selectionEnd && selectionStart !== selectionEnd) {
			setContent(
				prevContent =>
					prevContent.substring(0, selectionStart) +
					'#### ' +
					prevContent.substring(selectionStart, prevContent.length)
			);
		} else if (
			selectionStart &&
			selectionEnd &&
			selectionStart === selectionEnd &&
			selectionStart < content.length
		) {
			const start = content.substring(0, selectionStart).lastIndexOf('\n') + 1;

			setContent(
				prevContent =>
					prevContent.substring(0, start) +
					'#### ' +
					prevContent.substring(start, prevContent.length)
			);
		} else {
			setContent(
				prevContent =>
					prevContent + (prevContent.length === 0 ? '#### ' : '\n#### ')
			);
			setShouldFocus(true);
		}

		setChanged('header');
	}, [content]);

	const handleQuoteClick = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (selectionStart && selectionEnd && selectionStart !== selectionEnd) {
			setContent(
				prevContent =>
					prevContent.substring(0, selectionStart) +
					(selectionStart === 0 ? '> ' : '\n\n> ') +
					prevContent.substring(selectionStart, selectionEnd) +
					'\n\n' +
					prevContent.substring(selectionEnd, prevContent.length)
			);
		} else if (
			selectionStart &&
			selectionEnd &&
			selectionStart === selectionEnd &&
			selectionStart < content.length
		) {
			const start = content.substring(0, selectionStart).lastIndexOf('\n') + 1;
			const isOneLine = !content.includes('\n');
			let end = content.indexOf('\n', selectionEnd);

			if (end === -1) {
				end = content.length;
			}

			if (isOneLine) {
				setContent(prevContent => '> ' + prevContent);
			} else {
				const linesAbove = /.+\n/.test(content.substring(0, selectionStart));
				const linesBelow = /\n.+/.test(
					content.substring(selectionEnd, content.length)
				);
				setContent(
					prevContent =>
						prevContent.substring(0, start) +
						`${linesAbove ? '\n' : ''}> ` +
						prevContent.substring(start, end) +
						(linesBelow ? '\n' : '') +
						prevContent.substring(end, prevContent.length)
				);
			}
		} else {
			setContent(prevContent =>
				prevContent.length === 0 ? '> ' : prevContent + '\n\n> '
			);
			setShouldFocus(true);
		}

		setChanged('quote');
	}, [content]);

	const handleLinkClick = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (selectionStart && selectionEnd && selectionStart !== selectionEnd) {
			setContent(
				prevContent =>
					prevContent.substring(0, selectionStart) +
					'[' +
					prevContent.substring(selectionStart, selectionEnd) +
					'](url)' +
					prevContent.substring(selectionEnd, prevContent.length)
			);
		} else if (
			selectionStart &&
			selectionEnd &&
			selectionStart === selectionEnd &&
			selectionStart < content.length
		) {
			const start = content.substring(0, selectionStart).lastIndexOf(' ') + 1;
			let end = content.indexOf(' ', selectionEnd);

			if (end === -1) {
				end = content.length;
			}

			setContent(
				prevContent =>
					prevContent.substring(0, start) +
					'[' +
					prevContent.substring(start, end) +
					'](url)' +
					prevContent.substring(end, prevContent.length)
			);
		} else {
			setContent(prevContent => prevContent + '[](url)');
			setShouldFocus(true);
		}

		setChanged('link');
	}, [content]);

	if (changed && textAreaRef.current?.value === content) {
		if (shouldFocus) {
			textAreaRef.current.focus();

			if (changed === 'bold') {
				textAreaRef.current.setSelectionRange(
					content.length - 2,
					content.length - 2
				);
			}
			if (changed === 'italic') {
				textAreaRef.current.setSelectionRange(
					content.length - 1,
					content.length - 1
				);
			}
			if (changed === 'header' || changed === 'quote') {
				textAreaRef.current.setSelectionRange(content.length, content.length);
			}
			if (changed === 'link') {
				textAreaRef.current.setSelectionRange(
					content.length - 6,
					content.length - 6
				);
			}

			setShouldFocus(false);
		}

		onChange(content);
		setChanged(null);
	}

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
				<>
					<div className={classes['text-effect-buttons']}>
						<button
							aria-label="Insert header"
							className={classes['text-effect-button']}
							type="button"
							onClick={handleHeaderClick}
							style={{ fontFamily: 'var(--font-fantasy)' }}
						>
							H
						</button>
						<button
							aria-label="Insert bold text"
							className={classes['text-effect-button']}
							onClick={handleBoldClick}
							type="button"
							style={{ fontWeight: 'bold' }}
						>
							B
						</button>
						<button
							aria-label="Insert italic text"
							className={classes['text-effect-button']}
							type="button"
							onClick={handleItalicClick}
							style={{ fontStyle: 'italic' }}
						>
							I
						</button>
						<button
							aria-label="Insert block quote"
							className={classes['text-effect-button']}
							type="button"
							onClick={handleQuoteClick}
						>
							Q
						</button>
						<button
							aria-label="Insert link"
							className={classes['text-effect-button']}
							type="button"
							onClick={handleLinkClick}
						>
							<LinkIcon className={classes['text-effect-button-icon']} />
						</button>
					</div>
					<textarea
						onChange={handleTextAreaChange}
						className={`${classes['text-input']}${
							error && touched ? ` ${classes.error}` : ''
						}`}
						ref={textAreaRef as MutableRefObject<HTMLTextAreaElement>}
						rows={numberOfRows}
						cols={numberOfCols}
						onBlur={handleTextAreaBlur}
						id={id}
						value={content}
					></textarea>
				</>
			)}
			{error && touched && (
				<div className={classes['error-message']}>{error}</div>
			)}
		</div>
	);
};

export default MarkdownTextArea;
