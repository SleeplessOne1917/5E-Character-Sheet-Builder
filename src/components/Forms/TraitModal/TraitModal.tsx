'use client';

import Button from '../../Button/Button';
import { CSSProperties } from 'react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import ModalBackground from '../../ModalBackground/ModalBackground';
import Trait from '../../../types/trait';
import classes from './TraitModal.module.css';
import dynamic from 'next/dynamic';

const MarkdownParser = dynamic(
	() => import('../../MarkdownParser/MarkdownParser'),
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

const buttonStyle: CSSProperties = {
	flexGrow: 1,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	fontSize: '2rem',
	border: 0,
	margin: 0,
	borderRadius: 0,
	width: '50%'
};

type TraitModalProps = {
	show: boolean;
	onClose: () => void;
	onAction: () => void;
	mode: 'omit' | 'include';
	trait: Pick<Trait, 'name' | 'description'>;
};

const TraitModal = ({
	show,
	onAction,
	onClose,
	mode,
	trait
}: TraitModalProps) => {
	return (
		<ModalBackground show={show} testId="trait-modal">
			<div className={classes.modal}>
				<div className={classes.title}>{trait.name}</div>
				<div className={classes.content}>
					{show && <MarkdownParser input={trait.description} />}
				</div>
				<div className={classes.buttons}>
					<Button onClick={onAction} style={buttonStyle} positive>
						{mode === 'include' ? 'Include' : 'Omit'} Trait
					</Button>
					<Button onClick={onClose} style={buttonStyle}>
						Close
					</Button>
				</div>
			</div>
		</ModalBackground>
	);
};

export default TraitModal;
