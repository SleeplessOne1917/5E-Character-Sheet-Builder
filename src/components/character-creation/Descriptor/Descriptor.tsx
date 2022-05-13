import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { KeyboardEventHandler, useCallback, useEffect, useState } from 'react';

import classes from './Descriptor.module.css';

type DescriptorProps = {
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
	const toggleOpenKeyUp: KeyboardEventHandler<HTMLDivElement> = useCallback(
		event => {
			if (event.code === 'Enter') {
				toggleOpen();
			}
		},
		[toggleOpen]
	);

	return (
		<div className={classes.descriptor}>
			<div
				className={classes.title}
				tabIndex={0}
				aria-label={title}
				onClick={toggleOpen}
				onKeyUp={toggleOpenKeyUp}
				style={{
					borderBottomLeftRadius: isOpen ? '0' : '0.5rem',
					borderBottomRightRadius: isOpen ? '0' : '0.5rem'
				}}
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

export default Descriptor;
