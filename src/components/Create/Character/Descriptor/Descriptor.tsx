'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import {
	KeyboardEventHandler,
	ReactNode,
	forwardRef,
	memo,
	useCallback,
	useState
} from 'react';

import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner';
import classes from './Descriptor.module.css';
import dynamic from 'next/dynamic';
import { handleKeyDownEvent } from '../../../../services/handlerService';

const MarkdownParser = dynamic(
	() => import('../../../MarkdownParser/MarkdownParser'),
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
						<MarkdownParser input={description} />
					</div>
				)}
			</div>
		);
	}
);

Descriptor.displayName = 'Descriptor';

export default memo(Descriptor);
