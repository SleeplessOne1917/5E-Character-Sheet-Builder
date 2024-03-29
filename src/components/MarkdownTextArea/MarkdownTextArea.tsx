'use client';

import {
	ArrowUturnLeftIcon,
	ArrowUturnRightIcon,
	LinkIcon,
	ListBulletIcon
} from '@heroicons/react/20/solid';
import {
	CSSProperties,
	ChangeEventHandler,
	FocusEvent,
	KeyboardEvent,
	MouseEventHandler,
	MutableRefObject,
	PropsWithChildren,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';

import Button from '../Button/Button';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import classes from './MarkdownTextArea.module.css';
import { convertRemToPixels } from '../../services/remToPixelsService';
import dynamic from 'next/dynamic';

const MarkdownParser = dynamic(
	() => import('../MarkdownParser/MarkdownParser'),
	{
		loading: () => (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<LoadingSpinner />
			</div>
		)
	}
);

type MarkdownTextAreaProps = {
	value?: string;
	onChange?: (value: string) => void;
	onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
	touched?: boolean;
	error?: string;
	id?: string;
	label?: string;
};

type TextEditButtonProps = {
	label: string;
	style?: CSSProperties;
	onClick: MouseEventHandler<HTMLButtonElement>;
	tooltip: string;
	disabled?: boolean;
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
const endsWithNumberListRegex = /(?:(?:^\s*)|(?:\n\s*))(\d+)\.\s+(.*)$/;

const TextEditButton = ({
	label,
	style,
	onClick,
	children,
	tooltip,
	disabled = false
}: PropsWithChildren<TextEditButtonProps>) => (
	<button
		aria-label={label}
		className={classes['text-effect-button']}
		type="button"
		onClick={onClick}
		style={style}
		disabled={disabled}
	>
		{children}
		<span className={classes.tooltip}>{tooltip}</span>
	</button>
);

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
	const [undoRedoStates, setUndoRedoStates] = useState<string[]>([value ?? '']);
	const [currentUndoRedoIndex, setCurrentUndoRedoIndex] = useState(0);
	const [changeTimeout, setChangeTimeout] = useState<NodeJS.Timeout>();
	const [changedFromUndoRedo, setChangedFromUndoRedo] = useState(false);

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

	const addUndo = useCallback(
		(str: string) => {
			setUndoRedoStates(prev => [
				...prev.slice(0, currentUndoRedoIndex + 1),
				str
			]);
			setCurrentUndoRedoIndex(prev => prev + 1);
		},
		[currentUndoRedoIndex]
	);

	const handleTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> =
		useCallback(
			event => {
				onChange(event.target.value);
				setContent(event.target.value);

				if (changeTimeout) {
					clearTimeout(changeTimeout);
				}

				const timeout = setTimeout(() => {
					if (event.target.value !== undoRedoStates[currentUndoRedoIndex]) {
						addUndo(event.target.value);
					}
				}, 750);

				setChangeTimeout(timeout);

				setNumberOfRows(
					calculateNumberOfRows(
						event.target.value,
						textAreaRef.current?.cols ?? 20
					)
				);
			},
			[onChange, changeTimeout, addUndo, undoRedoStates, currentUndoRedoIndex]
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

	const handleBold = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (
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
	}, [content]);

	const handleBoldClick = useCallback(() => {
		if (!textAreaBlurToTextButton) {
			setContent(prevContent => prevContent + '****');
			setItemsBeforeEndToFocus(2);
			setChanged(true);
		} else {
			handleBold();
		}

		setTextAreaBlurToTextButton(false);
	}, [handleBold, textAreaBlurToTextButton]);

	const handleItalic = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (
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
	}, [content]);

	const handleItalicClick = useCallback(() => {
		if (!textAreaBlurToTextButton) {
			setContent(prevContent => prevContent + '**');
			setItemsBeforeEndToFocus(1);
			setChanged(true);
		} else {
			handleItalic();
		}

		setTextAreaBlurToTextButton(false);
	}, [handleItalic, textAreaBlurToTextButton]);

	const handleHeader = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (
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
	}, [content]);

	const handleHeaderClick = useCallback(() => {
		if (!textAreaBlurToTextButton) {
			setContent(
				prevContent =>
					prevContent + (prevContent.length === 0 ? '#### ' : '\n#### ')
			);
			setItemsBeforeEndToFocus(0);
			setChanged(true);
		} else {
			handleHeader();
		}

		setTextAreaBlurToTextButton(false);
	}, [handleHeader, textAreaBlurToTextButton]);

	const handleQuote = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (
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
	}, [content]);

	const handleQuoteClick = useCallback(() => {
		if (!textAreaBlurToTextButton) {
			setContent(prevContent =>
				prevContent.length === 0 ? '> ' : prevContent + '\n\n> '
			);
			setItemsBeforeEndToFocus(0);
			setChanged(true);
		} else {
			handleQuote();
		}

		setTextAreaBlurToTextButton(false);
	}, [handleQuote, textAreaBlurToTextButton]);

	const handleLink = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (
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
	}, [content]);

	const handleLinkClick = useCallback(() => {
		if (!textAreaBlurToTextButton) {
			setContent(prevContent => prevContent + '[](url)');
			setItemsBeforeEndToFocus(6);
			setChanged(true);
		} else {
			handleLink();
		}

		setTextAreaBlurToTextButton(false);
	}, [handleLink, textAreaBlurToTextButton]);

	const handleBulletList = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (
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
				const lineAboveIsBullet = /(?:^|\n)(?!\n)\s*-\s+\S+$/.test(
					content.substring(0, start)
				);
				const lineBelowIsBullet = /^\n(?!\n)\s*-\s+.*/.test(
					content.substring(end, content.length)
				);

				setContent(
					prevContent =>
						prevContent.substring(0, start) +
						`${
							linesAbove && !lineAboveIsBullet
								? '\n\n'
								: start === 0
								? ''
								: '\n'
						}- ` +
						prevContent.substring(start + 1, end) +
						(linesBelow && !lineBelowIsBullet ? '\n' : '') +
						prevContent.substring(end, prevContent.length)
				);
			}
		}

		setChanged(true);
	}, [content]);

	const handleBulletListClick = useCallback(() => {
		if (!textAreaBlurToTextButton) {
			setContent(prevContent =>
				prevContent.length === 0 ? '- ' : prevContent + '\n\n- '
			);
			setItemsBeforeEndToFocus(0);
			setChanged(true);
		} else {
			handleBulletList();
		}

		setTextAreaBlurToTextButton(false);
	}, [handleBulletList, textAreaBlurToTextButton]);

	const handleNumberedList = useCallback(() => {
		const selectionStart = textAreaRef.current?.selectionStart;
		const selectionEnd = textAreaRef.current?.selectionEnd;

		if (
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

			let lineHasNumber = false;
			if (/\n?\s*\d+\.\s+/.test(content.substring(start, end))) {
				lineHasNumber = true;
			}

			if (lineHasNumber) {
				setContent(
					prevContent =>
						prevContent.substring(0, start) +
						prevContent.substring(start, end).replace(/(?!\n)\s*\d+\.\s+/, '') +
						prevContent.substring(end, prevContent.length)
				);
			} else {
				const linesAbove = linesAboveRegex.test(
					content.substring(0, start + 1)
				);
				const linesBelow = linesBelowRegex.test(
					content.substring(end, content.length)
				);
				const linesAboveNumberListExec = endsWithNumberListRegex.exec(
					content.substring(0, start)
				);
				const currentNumber = linesAboveNumberListExec
					? parseInt(linesAboveNumberListExec[1])
					: 0;
				const linesBelowNumberList = /^\n(?!\n)\s*\d+\.\s+.*/.test(
					content.substring(end, content.length)
				);

				setContent(
					prevContent =>
						prevContent.substring(0, start) +
						`${
							linesAbove && !linesAboveNumberListExec
								? '\n\n'
								: start === 0
								? ''
								: '\n'
						}${currentNumber + 1}. ` +
						prevContent.substring(start + 1, end) +
						(linesBelow && !linesBelowNumberList ? '\n' : '') +
						prevContent.substring(end, prevContent.length)
				);
			}
		}

		setChanged(true);
	}, [content]);

	const handleNumberedListClick = useCallback(() => {
		if (!textAreaBlurToTextButton) {
			const endsWithListNumberRegexExec = endsWithNumberListRegex.exec(content);
			const currentListNumber = endsWithListNumberRegexExec
				? parseInt(endsWithListNumberRegexExec[1])
				: 0;
			const currentListItem = endsWithListNumberRegexExec
				? endsWithListNumberRegexExec[2]
				: '';
			if (endsWithListNumberRegexExec) {
				if (currentListItem.length > 0) {
					setContent(
						prevContent => prevContent + `\n${currentListNumber + 1}. `
					);
				}
			} else {
				setContent(prevContent =>
					prevContent.length === 0 ? '1. ' : prevContent + '\n\n1. '
				);
			}
			setItemsBeforeEndToFocus(0);
			setChanged(true);
		} else {
			handleNumberedList();
		}

		setTextAreaBlurToTextButton(false);
	}, [content, textAreaBlurToTextButton, handleNumberedList]);

	const handleUndo = useCallback(() => {
		if (currentUndoRedoIndex > 0) {
			setContent(undoRedoStates[currentUndoRedoIndex - 1]);
			setChangedFromUndoRedo(true);
			setChanged(true);
			setCurrentUndoRedoIndex(prev => prev - 1);
		}
	}, [currentUndoRedoIndex, undoRedoStates]);

	const handleRedo = useCallback(() => {
		if (currentUndoRedoIndex < undoRedoStates.length - 1) {
			setContent(undoRedoStates[currentUndoRedoIndex + 1]);
			setChangedFromUndoRedo(true);
			setChanged(true);
			setCurrentUndoRedoIndex(prev => prev + 1);
		}
	}, [currentUndoRedoIndex, undoRedoStates]);

	if (changed && textAreaRef.current?.value === content) {
		if (itemsBeforeEndToFocus !== undefined && itemsBeforeEndToFocus !== null) {
			textAreaRef.current.focus();

			textAreaRef.current.setSelectionRange(
				content.length - itemsBeforeEndToFocus,
				content.length - itemsBeforeEndToFocus
			);

			setItemsBeforeEndToFocus(null);
		}
		if (
			!changedFromUndoRedo &&
			content !== undoRedoStates[currentUndoRedoIndex]
		) {
			addUndo(content);
		}

		onChange(content);
		setChanged(false);
		setChangedFromUndoRedo(false);
	}

	const handleTextAreaKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.code === 'Enter') {
				const selectionStart = textAreaRef.current?.selectionStart;
				const selectionEnd = textAreaRef.current?.selectionEnd;
				if (
					isNotNullOrUndefined(selectionStart) &&
					isNotNullOrUndefined(selectionEnd) &&
					selectionStart === selectionEnd
				) {
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
					const endsWithListNumberRegexExec = endsWithNumberListRegex.exec(
						content.substring(0, end)
					);
					const currentNumber = endsWithListNumberRegexExec
						? parseInt(endsWithListNumberRegexExec[1])
						: 0;

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
									prevContent.substring(
										selectionEnd as number,
										prevContent.length
									)
							);
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
						setItemsBeforeEndToFocus(content.length - (selectionEnd as number));
					} else if (endsWithListNumberRegexExec) {
						event.preventDefault();
						const lineHasContent = /\n?\s*\d+\.\s+\S+/.test(
							content.substring(start, end)
						);

						if (lineHasContent) {
							setContent(
								prevContent =>
									prevContent.substring(0, selectionStart) +
									`\n${currentNumber + 1}. ` +
									prevContent.substring(
										selectionEnd as number,
										prevContent.length
									)
							);
						} else {
							setContent(
								prevContent =>
									prevContent.substring(0, start) +
									prevContent
										.substring(start, end)
										.replace(/(?!\n)\s*\d+\.\s+/, '') +
									prevContent.substring(end, prevContent.length)
							);
						}

						setChanged(true);
						setItemsBeforeEndToFocus(content.length - (selectionEnd as number));
					}
				}
			}
			if (event.ctrlKey) {
				if (event.code === 'KeyZ') {
					event.preventDefault();
					if (event.shiftKey) {
						handleRedo();
					} else {
						handleUndo();
					}
				} else if (event.code === 'KeyY') {
					event.preventDefault();
					handleRedo();
				} else if (event.code === 'KeyB') {
					event.preventDefault();
					handleBold();
				} else if (event.code === 'KeyI') {
					event.preventDefault();
					handleItalic();
				} else if (event.code === 'KeyH') {
					event.preventDefault();
					handleHeader();
				} else if (event.code === 'KeyQ') {
					event.preventDefault();
					handleQuote();
				} else if (event.code === 'KeyL') {
					event.preventDefault();
					handleLink();
				} else if (event.code === 'KeyU') {
					event.preventDefault();
					handleBulletList();
				} else if (event.code === 'KeyO') {
					event.preventDefault();
					handleNumberedList();
				}
			}
		},
		[
			content,
			handleUndo,
			handleRedo,
			handleBold,
			handleItalic,
			handleHeader,
			handleQuote,
			handleLink,
			handleBulletList,
			handleNumberedList
		]
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
						<TextEditButton
							label="Insert header"
							onClick={handleHeaderClick}
							style={{ fontFamily: 'var(--font-fantasy)' }}
							tooltip="Header - Ctrl + H"
						>
							H
						</TextEditButton>
						<TextEditButton
							label="Insert bold text"
							onClick={handleBoldClick}
							style={{ fontWeight: 'bold' }}
							tooltip="Bold - Ctrl + B"
						>
							B
						</TextEditButton>
						<TextEditButton
							label="Insert italic text"
							onClick={handleItalicClick}
							style={{ fontStyle: 'italic' }}
							tooltip="Italic - Ctrl + I"
						>
							I
						</TextEditButton>
						<TextEditButton
							label="Insert blockquote"
							onClick={handleQuoteClick}
							tooltip="Blockquote - Ctrl + Q"
						>
							<svg className={classes['text-effect-button-icon']}>
								<use xlinkHref={`/Icons.svg#quote`} />
							</svg>
						</TextEditButton>
						<TextEditButton
							label="Insert hyperlink"
							onClick={handleLinkClick}
							tooltip="Hyperlink - Ctrl + L"
						>
							<LinkIcon className={classes['text-effect-button-icon']} />
						</TextEditButton>
						<TextEditButton
							label="Insert bulleted list"
							onClick={handleBulletListClick}
							tooltip="Bulleted List - Ctrl + U"
						>
							<ListBulletIcon className={classes['text-effect-button-icon']} />
						</TextEditButton>
						<TextEditButton
							label="Insert numbered list"
							onClick={handleNumberedListClick}
							tooltip="Numbered List - Ctrl + O"
						>
							<svg className={classes['text-effect-button-icon']}>
								<use xlinkHref={`/Icons.svg#numbered-list`} />
							</svg>
						</TextEditButton>
						<TextEditButton
							label="Undo"
							onClick={handleUndo}
							disabled={currentUndoRedoIndex === 0}
							tooltip="Undo - Ctrl + Z"
						>
							<ArrowUturnLeftIcon
								className={classes['text-effect-button-icon']}
							/>
						</TextEditButton>
						<TextEditButton
							label="Redo"
							onClick={handleRedo}
							disabled={currentUndoRedoIndex === undoRedoStates.length - 1}
							tooltip="Redo - Ctrl + Y or Ctrl + Shift + Z"
						>
							<ArrowUturnRightIcon
								className={classes['text-effect-button-icon']}
							/>
						</TextEditButton>
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
