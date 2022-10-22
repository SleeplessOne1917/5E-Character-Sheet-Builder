import {
	ChangeEventHandler,
	FocusEvent,
	KeyboardEvent,
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import { LinkIcon, ListBulletIcon } from '@heroicons/react/20/solid';

import Button from '../Button/Button';
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

const isNotNullOrUndefined = (thing: any) =>
	thing !== null && thing !== undefined;

const lastIndexOfRegex = (str: string, regex: RegExp) => {
	let index = -1;

	while (str.substring(index + 1, str.length).search(regex) > -1) {
		index =
			str.substring(index + 1, str.length).search(regex) +
			(index > -1 ? str.substring(0, index + 1).length : 0);
	}

	return index;
};

const indexOfRegex = (str: string, regex: RegExp, startIndex = 0) => {
	let start = startIndex;
	if (start < 0) {
		start = 0;
	}
	if (start >= str.length) {
		return -1;
	}

	const index = str.substring(start, str.length).search(regex);

	return index > -1
		? index + (start > 0 ? str.substring(0, start).length : 0)
		: index;
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

const linesAboveRegex = /\S+((?!\n)\s*)?\n$/;
const linesBelowRegex = /^\n(?!\n)\s*\S+/;

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
	const [changed, setChanged] = useState(false);
	const [itemsBeforeEndToFocus, setItemsBeforeEndToFocus] =
		useState<number | null>();
	const [textAreaBlurToTextButton, setTextAreaBlurToTextButton] =
		useState(false);

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
				event.relatedTarget?.tagName.toLowerCase() !== 'button' &&
				event.relatedTarget?.innerHTML !== 'B' &&
				event.relatedTarget?.innerHTML !== 'I' &&
				event.relatedTarget?.innerHTML !== 'H' &&
				!event.relatedTarget?.innerHTML.startsWith('<svg')
			) {
				textAreaRef.current?.setSelectionRange(-1, -1);
				setTextAreaBlurToTextButton(false);
			} else {
				setTextAreaBlurToTextButton(true);
			}
		},
		[onBlur]
	);

	const handleBoldClick = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (!textAreaBlurToTextButton) {
			setContent(prevContent => prevContent + '****');
			setItemsBeforeEndToFocus(2);
		} else if (
			isNotNullOrUndefined(selectionStart) &&
			isNotNullOrUndefined(selectionEnd) &&
			selectionStart !== selectionEnd
		) {
			setContent(
				prevContent =>
					prevContent.substring(0, selectionStart) +
					'**' +
					prevContent.substring(selectionStart as number, selectionEnd) +
					'**' +
					prevContent.substring(selectionEnd as number, prevContent.length)
			);
		} else if (
			isNotNullOrUndefined(selectionStart) &&
			isNotNullOrUndefined(selectionEnd) &&
			selectionStart === selectionEnd
		) {
			const start =
				lastIndexOfRegex(content.substring(0, selectionStart), /\s/) + 1;
			let end = indexOfRegex(content, /\s/, selectionEnd);

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
		}

		setChanged(true);
		setTextAreaBlurToTextButton(false);
	}, [content, textAreaBlurToTextButton]);

	const handleItalicClick = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (!textAreaBlurToTextButton) {
			setContent(prevContent => prevContent + '**');
			setItemsBeforeEndToFocus(1);
		} else if (
			isNotNullOrUndefined(selectionStart) &&
			isNotNullOrUndefined(selectionEnd) &&
			selectionStart !== selectionEnd
		) {
			setContent(
				prevContent =>
					prevContent.substring(0, selectionStart) +
					'*' +
					prevContent.substring(selectionStart as number, selectionEnd) +
					'*' +
					prevContent.substring(selectionEnd as number, prevContent.length)
			);
		} else if (
			isNotNullOrUndefined(selectionStart) &&
			isNotNullOrUndefined(selectionEnd) &&
			selectionStart === selectionEnd
		) {
			const start =
				lastIndexOfRegex(content.substring(0, selectionStart), /\s/) + 1;
			let end = indexOfRegex(content, /\s/, selectionEnd);

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
		}

		setChanged(true);
		setTextAreaBlurToTextButton(false);
	}, [content, textAreaBlurToTextButton]);

	const handleHeaderClick = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (!textAreaBlurToTextButton) {
			setContent(
				prevContent =>
					prevContent + (prevContent.length === 0 ? '#### ' : '\n#### ')
			);
			setItemsBeforeEndToFocus(0);
		} else if (
			isNotNullOrUndefined(selectionStart) &&
			isNotNullOrUndefined(selectionEnd) &&
			selectionStart !== selectionEnd
		) {
			setContent(
				prevContent =>
					prevContent.substring(0, selectionStart) +
					'#### ' +
					prevContent.substring(selectionStart as number, prevContent.length)
			);
		} else if (
			isNotNullOrUndefined(selectionStart) &&
			isNotNullOrUndefined(selectionEnd) &&
			selectionStart === selectionEnd
		) {
			const start = content.substring(0, selectionStart).lastIndexOf('\n') + 1;

			setContent(
				prevContent =>
					prevContent.substring(0, start) +
					'#### ' +
					prevContent.substring(start, prevContent.length)
			);
		}

		setChanged(true);
		setTextAreaBlurToTextButton(false);
	}, [content, textAreaBlurToTextButton]);

	const handleQuoteClick = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (!textAreaBlurToTextButton) {
			setContent(prevContent =>
				prevContent.length === 0 ? '> ' : prevContent + '\n\n> '
			);
			setItemsBeforeEndToFocus(0);
		} else if (
			isNotNullOrUndefined(selectionStart) &&
			isNotNullOrUndefined(selectionEnd) &&
			selectionStart !== selectionEnd
		) {
			setContent(
				prevContent =>
					prevContent.substring(0, selectionStart) +
					(selectionStart === 0 ? '> ' : '\n\n> ') +
					prevContent.substring(selectionStart as number, selectionEnd) +
					'\n\n' +
					prevContent.substring(selectionEnd as number, prevContent.length)
			);
		} else if (
			isNotNullOrUndefined(selectionStart) &&
			isNotNullOrUndefined(selectionEnd) &&
			selectionStart === selectionEnd
		) {
			let start = content.substring(0, selectionStart).lastIndexOf('\n');

			if (start < 0) {
				start = 0;
			}

			let end = content.indexOf('\n', selectionEnd);

			if (end === -1) {
				end = content.length;
			}

			const linesAbove = linesAboveRegex.test(content.substring(0, start + 1));
			const linesBelow = linesBelowRegex.test(
				content.substring(end, content.length)
			);

			setContent(
				prevContent =>
					prevContent.substring(0, start) +
					`${linesAbove ? '\n\n' : start === 0 ? '' : '\n'}> ` +
					prevContent.substring(start + 1, end) +
					(linesBelow ? '\n' : '') +
					prevContent.substring(end, prevContent.length)
			);
		}

		setChanged(true);
		setTextAreaBlurToTextButton(false);
	}, [content, textAreaBlurToTextButton]);

	const handleLinkClick = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (!textAreaBlurToTextButton) {
			setContent(prevContent => prevContent + '[](url)');
			setItemsBeforeEndToFocus(6);
		} else if (
			isNotNullOrUndefined(selectionStart) &&
			isNotNullOrUndefined(selectionEnd) &&
			selectionStart !== selectionEnd
		) {
			setContent(
				prevContent =>
					prevContent.substring(0, selectionStart) +
					'[' +
					prevContent.substring(selectionStart as number, selectionEnd) +
					'](url)' +
					prevContent.substring(selectionEnd as number, prevContent.length)
			);
		} else if (
			isNotNullOrUndefined(selectionStart) &&
			isNotNullOrUndefined(selectionEnd) &&
			selectionStart === selectionEnd
		) {
			const start =
				lastIndexOfRegex(content.substring(0, selectionStart), /\s/) + 1;
			let end = indexOfRegex(content, /\s/, selectionEnd);

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
		}

		setChanged(true);
		setTextAreaBlurToTextButton(false);
	}, [content, textAreaBlurToTextButton]);

	const handleBulletListClick = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (!textAreaBlurToTextButton) {
			setContent(prevContent =>
				prevContent.length === 0 ? '- ' : prevContent + '\n\n- '
			);
			setItemsBeforeEndToFocus(0);
		} else if (
			isNotNullOrUndefined(selectionStart) &&
			isNotNullOrUndefined(selectionEnd)
		) {
			let start = content.substring(0, selectionStart).lastIndexOf('\n');
			if (start === -1) {
				start = 0;
			}

			let end = content.indexOf('\n', selectionEnd);

			if (end === -1) {
				end = content.length;
			}

			let lineHasBullet = false;
			if (/\n?\s*-\s+/.test(content.substring(start, end))) {
				lineHasBullet = true;
			}

			if (lineHasBullet) {
				setContent(
					prevContent =>
						prevContent.substring(0, start) +
						prevContent.substring(start, end).replace(/(?!\n)\s*-\s+/, '') +
						prevContent.substring(end, prevContent.length)
				);
			} else {
				const linesAbove = linesAboveRegex.test(
					content.substring(0, start + 1)
				);
				const linesBelow = linesBelowRegex.test(
					content.substring(end, content.length)
				);

				setContent(
					prevContent =>
						prevContent.substring(0, start) +
						`${linesAbove ? '\n\n' : start === 0 ? '' : '\n'}- ` +
						prevContent.substring(start + 1, end) +
						(linesBelow ? '\n' : '') +
						prevContent.substring(end, prevContent.length)
				);
			}
		}

		setChanged(true);
		setTextAreaBlurToTextButton(false);
	}, [content, textAreaBlurToTextButton]);

	if (changed && textAreaRef.current?.value === content) {
		if (itemsBeforeEndToFocus !== undefined && itemsBeforeEndToFocus !== null) {
			textAreaRef.current.focus();

			textAreaRef.current.setSelectionRange(
				content.length - itemsBeforeEndToFocus,
				content.length - itemsBeforeEndToFocus
			);

			setItemsBeforeEndToFocus(null);
		}

		onChange(content);
		setChanged(false);
	}

	const handleTextAreaKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.code === 'Enter') {
				const selectionStart = textAreaRef.current?.selectionStart;
				const selectionEnd = textAreaRef.current?.selectionEnd;
				if (selectionStart && selectionEnd && selectionStart === selectionEnd) {
					let start = content.substring(0, selectionStart).lastIndexOf('\n');
					if (start === -1) {
						start = 0;
					}

					let end = content.indexOf('\n', selectionEnd);

					if (end === -1) {
						end = content.length;
					}

					const lineHasBullet = /\n?\s*-\s+/.test(
						content.substring(start, end)
					);

					if (lineHasBullet) {
						event.preventDefault();
						const lineHasContent = /\n?\s*-\s+\S+/.test(
							content.substring(start, end)
						);

						if (lineHasContent) {
							setContent(
								prevContent =>
									prevContent.substring(0, selectionStart) +
									'\n- ' +
									prevContent.substring(selectionEnd, prevContent.length)
							);
							setItemsBeforeEndToFocus(content.length - selectionEnd);
						} else {
							setContent(
								prevContent =>
									prevContent.substring(0, start) +
									prevContent
										.substring(start, end)
										.replace(/(?!\n)\s*-\s+/, '') +
									prevContent.substring(end, prevContent.length)
							);
						}

						setChanged(true);
					}
				}
			}
		},
		[content]
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
							<svg className={classes['text-effect-button-icon']}>
								<use xlinkHref={`/Icons.svg#quote`} />
							</svg>
						</button>
						<button
							aria-label="Insert link"
							className={classes['text-effect-button']}
							type="button"
							onClick={handleLinkClick}
						>
							<LinkIcon className={classes['text-effect-button-icon']} />
						</button>
						<button
							aria-label="Insert bulleted list"
							className={classes['text-effect-button']}
							type="button"
							onClick={handleBulletListClick}
						>
							<ListBulletIcon className={classes['text-effect-button-icon']} />
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
						onKeyDown={handleTextAreaKeyDown}
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
