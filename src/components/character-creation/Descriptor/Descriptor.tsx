import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { KeyboardEventHandler, memo, useCallback } from 'react';

import classes from './Descriptor.module.css';
import { handleKeyDownEvent } from '../../../services/handlerService';

export type DescriptorProps = {
	title: string;
	description: string | string[];
	isOpen: boolean;
	toggleOpen: () => void;
};

const Descriptor = ({
	title,
	description,
	isOpen,
	toggleOpen
}: DescriptorProps) => {
	const toggleOpenKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
		event => {
			handleKeyDownEvent<HTMLDivElement>(event, toggleOpen);
		},
		[toggleOpen]
	);

	return (
		<div className={classes.descriptor} data-testid="descriptor">
			<div
				className={classes.title}
				tabIndex={0}
				aria-label={title}
				onClick={toggleOpen}
				onKeyDown={toggleOpenKeyDown}
				style={{
					borderBottomLeftRadius: isOpen ? '0' : '0.5rem',
					borderBottomRightRadius: isOpen ? '0' : '0.5rem'
				}}
				role="button"
			>
				{title}
				{isOpen ? (
					<ChevronUpIcon className={classes.chevron} />
				) : (
					<ChevronDownIcon className={classes.chevron} />
				)}
			</div>
			{isOpen && (
				<div className={classes.content}>
					{Array.isArray(description) ? (
						description.map((d, i) => <p key={i}>{d}</p>)
					) : (
						<p>{description}</p>
					)}
				</div>
			)}
		</div>
	);
};

export default memo(Descriptor);
