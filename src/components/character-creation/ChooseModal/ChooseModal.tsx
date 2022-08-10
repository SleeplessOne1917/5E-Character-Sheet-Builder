import { CSSProperties } from 'react';
import { Descriptor } from '../../../types/creation';
import Button from '../../Button/Button';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import DescriptorComponent from '../Descriptor/Descriptor';
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
};

// TODO: Automatically tab to modal

const ChooseModal = ({
	show,
	onClose,
	onChoose,
	iconId,
	disableChoose,
	loading,
	error,
	title,
	descriptors
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
					<div className={classes['modal-content-container']}>
						{loading ? (
							<LoadingSpinner />
						) : error ? (
							<p className={classes['error-message']}>
								Could not load race details
							</p>
						) : (
							descriptors &&
							descriptors.map(descriptor => (
								<DescriptorComponent
									key={descriptor.title}
									title={descriptor.title}
									description={descriptor.description}
								/>
							))
						)}
					</div>
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
