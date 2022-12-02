'use client';

import { CSSProperties, MutableRefObject, useEffect, useRef } from 'react';

import Button from '../Button/Button';
import { Descriptor } from '../../types/creation';
import DescriptorComponent from '../Create/Character/Descriptor/Descriptor';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ModalBackground from '../ModalBackground/ModalBackground';
import classes from './MoreInfoModal.module.css';

export type MoreInfoModalProps = {
	show: boolean;
	onClose: () => void;
	onAction: () => void;
	iconId: string;
	loading?: boolean;
	error?: boolean;
	title: string;
	descriptors?: Descriptor[];
	otherDescriptors?: Descriptor[];
	mode?: 'choose' | 'edit';
};

const buttonStyle: CSSProperties = {
	flexGrow: 1,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	fontSize: '2rem',
	border: 0,
	margin: 0,
	borderRadius: 0
};

const MoreInfoModal = ({
	show,
	onClose,
	onAction,
	iconId,
	loading = false,
	error = false,
	title,
	descriptors,
	otherDescriptors,
	mode = 'choose'
}: MoreInfoModalProps): JSX.Element => {
	const firstDescriptorRef = useRef<HTMLDivElement>();

	useEffect(() => {
		if (show && descriptors && descriptors.length > 0) {
			firstDescriptorRef.current?.focus();
		}
	}, [show, descriptors]);

	const contentContainerStyle: CSSProperties = loading
		? { justifyContent: 'center' }
		: {};

	return (
		<ModalBackground show={show} testId="choose-modal">
			<div className={classes.modal}>
				<div className={classes['icon-container']}>
					<svg className={classes.icon}>
						<use xlinkHref={`/Icons.svg#${iconId}`} />
					</svg>
				</div>
				<div className={classes['content-container']}>
					<h2 className={classes.title}>
						{loading ? 'Loading...' : error ? 'Error' : title}
					</h2>
					<div
						className={classes['modal-content-container']}
						style={contentContainerStyle}
					>
						{loading ? (
							<LoadingSpinner />
						) : error ? (
							<p className={classes['error-message']}>Could not load details</p>
						) : (
							descriptors &&
							descriptors.map((descriptor, index) => (
								<DescriptorComponent
									key={descriptor.title}
									title={descriptor.title}
									description={descriptor.description}
									ref={
										(index === 0
											? firstDescriptorRef
											: undefined) as MutableRefObject<HTMLDivElement>
									}
								/>
							))
						)}
					</div>
				</div>
				<div className={classes['other-container']}>
					{otherDescriptors?.map(descriptor => (
						<div key={descriptor.title} className={classes.other}>
							<div className={classes['other-label']}>{descriptor.title}</div>
							<div className={classes['other-data']}>
								{descriptor.description}
							</div>
						</div>
					))}
				</div>
				<div className={classes['buttons-container']}>
					<Button
						onClick={onAction}
						positive
						style={buttonStyle}
						disabled={loading || error}
					>
						{mode === 'choose' ? 'Choose' : 'Edit'}
					</Button>
					<Button onClick={onClose} style={buttonStyle}>
						Cancel
					</Button>
				</div>
			</div>
		</ModalBackground>
	);
};

export default MoreInfoModal;
