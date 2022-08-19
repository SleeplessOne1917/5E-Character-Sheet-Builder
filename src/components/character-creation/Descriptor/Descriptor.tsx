import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import {
	KeyboardEventHandler,
	forwardRef,
	memo,
	useCallback,
	useState,
	ReactNode
} from 'react';

import classes from './Descriptor.module.css';
import { handleKeyDownEvent } from '../../../services/handlerService';

export type DescriptorProps = {
	title: string;
	description: string | string[];
	table?: ReactNode;
};

const Descriptor = forwardRef<HTMLDivElement, DescriptorProps>(
	({ title, description, table }: DescriptorProps, ref) => {
		const [isOpen, setIsOpen] = useState(false);

		const toggleOpen = useCallback(
			() => setIsOpen(prevState => !prevState),
			[setIsOpen]
		);

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
					ref={ref}
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
						{table && <div className={classes['table-container']}>{table}</div>}
						{Array.isArray(description) ? (
							description.map((d, i) => <p key={i}>{d}</p>)
						) : (
							<p>{description}</p>
						)}
					</div>
				)}
			</div>
		);
	}
);

Descriptor.displayName = 'Descriptor';

export default memo(Descriptor);
