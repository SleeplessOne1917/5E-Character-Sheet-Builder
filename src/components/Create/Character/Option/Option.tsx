'use client';

import {
	ChevronDownIcon,
	ChevronRightIcon,
	ChevronUpIcon
} from '@heroicons/react/24/solid';
import {
	KeyboardEvent,
	KeyboardEventHandler,
	useCallback,
	useState
} from 'react';

import { SrdItem } from '../../../../types/srd';
import classes from './Option.module.css';
import { handleKeyDownEvent } from '../../../../services/handlerService';

type OptionProps = {
	option: SrdItem;
	subOptions?: SrdItem[];
	onChoose: (subOptionIndex?: string) => void;
};

const Option = ({ option, subOptions, onChoose }: OptionProps) => {
	const hasMultipleSubOptions = subOptions && subOptions.length > 1;
	const hasOneSubOption = subOptions && subOptions.length === 1;
	const title = hasOneSubOption ? subOptions[0].name : option.name;
	const [showSubOptions, setShowSubOptions] = useState(false);

	const handleClick = useCallback(() => {
		if (hasMultipleSubOptions) {
			setShowSubOptions(prevState => !prevState);
		} else if (hasOneSubOption) {
			onChoose(subOptions[0].index);
		} else {
			onChoose();
		}
	}, [
		setShowSubOptions,
		hasMultipleSubOptions,
		onChoose,
		hasOneSubOption,
		subOptions
	]);

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
		event => {
			handleKeyDownEvent<HTMLDivElement>(event, handleClick);
		},
		[handleClick]
	);

	const handleSubOptionClick = useCallback(
		(subraceIndex: string) => {
			onChoose(subraceIndex);
		},
		[onChoose]
	);

	const handleSubOptionKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>, subraceIndex: string) => {
			handleKeyDownEvent<HTMLDivElement>(event, () => onChoose(subraceIndex));
		},
		[onChoose]
	);

	return (
		<li className={classes['option-li']} data-testid="option">
			<div>
				<div
					className={classes['option-container']}
					tabIndex={0}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					aria-label={title}
					role="button"
				>
					<div className={classes['option-title']}>
						<div className={classes['icon-container']}>
							<svg className={classes.icon}>
								<use xlinkHref={`/Icons.svg#${option.index}`} />
							</svg>
						</div>{' '}
						{title}
					</div>
					{hasMultipleSubOptions ? (
						showSubOptions ? (
							<ChevronUpIcon
								className={classes.chevron}
								data-testid="chevron-up"
							/>
						) : (
							<ChevronDownIcon
								className={classes.chevron}
								data-testid="chevron-down"
							/>
						)
					) : (
						<ChevronRightIcon
							className={classes.chevron}
							data-testid="chevron-right"
						/>
					)}
				</div>
				{showSubOptions && (
					<ul className={classes['sub-option-list']}>
						{subOptions?.map(subOption => (
							<li key={subOption.index}>
								<div
									className={classes['option-container']}
									tabIndex={0}
									aria-label={subOption.name}
									onClick={() => handleSubOptionClick(subOption.index)}
									onKeyDown={event =>
										handleSubOptionKeyDown(event, subOption.index)
									}
								>
									<div className={classes['option-title']}>
										{subOption.name}
									</div>
									<ChevronRightIcon className={classes.chevron} />
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</li>
	);
};

export default Option;
