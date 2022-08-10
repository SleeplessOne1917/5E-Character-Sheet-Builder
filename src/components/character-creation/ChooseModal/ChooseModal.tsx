import { CSSProperties, MutableRefObject, useEffect, useRef } from 'react';

import Button from '../../Button/Button';
import { Descriptor } from '../../../types/creation';
import DescriptorComponent from '../Descriptor/Descriptor';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import classes from './ChooseModal.module.css';

export type ChooseModalProps = {
	show: boolean;
	onClose: () => void;
	onChoose: () => void;
	iconId: string;
	disableChoose?: boolean;
	loading?: boolean;
	error?: boolean;
	title: string;
	descriptors?: Descriptor[];
	otherDescriptors?: Descriptor[];
};

const ChooseModal = ({
	show,
	onClose,
	onChoose,
	iconId,
	disableChoose,
	loading = false,
	error = false,
	title,
	descriptors,
	otherDescriptors
}: ChooseModalProps): JSX.Element => {
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
		<div
			style={{ display: show ? 'flex' : 'none' }}
			className={classes['modal-container']}
			data-testid="choose-modal"
		>
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
							<p className={classes['error-message']}>
								Could not load race details
							</p>
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
						onClick={onChoose}
						positive
						style={buttonStyle}
						disabled={disableChoose}
					>
						Choose
					</Button>
					<Button onClick={onClose} style={buttonStyle}>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ChooseModal;
