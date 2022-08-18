import Button from '../../../Button/Button';
import { CSSProperties } from 'react';
import Descriptor from '../../Descriptor/Descriptor';
import { SrdSubclassItem } from '../../../../types/srd';
import styles from './SubclassSelector.module.css';

type SubclassSelectorProps = {
	subclass: SrdSubclassItem;
	onSelect: () => void;
	onDeselect: () => void;
	selected?: boolean;
};

const buttonStyle: CSSProperties = {
	position: 'absolute',
	top: '0.5rem',
	right: '0.5rem'
};

const SubclassSelector = ({
	subclass,
	onSelect,
	onDeselect,
	selected = false
}: SubclassSelectorProps) => (
	<div
		key={subclass.index}
		className={`${styles.subclass}${selected ? ` ${styles.selected}` : ''}`}
		data-testid="subclass-selector"
	>
		<h3 className={styles['subclass-heading']}>{subclass.name}</h3>
		{subclass.desc.map((desc, i) => (
			<p key={i} className={styles['subclass-description']}>
				{desc}
			</p>
		))}
		{[...subclass.subclass_levels]
			.sort((a, b) => a.level - b.level)
			.flatMap(level => level.features)
			.map(feature => (
				<Descriptor
					key={feature.index}
					title={feature.name}
					description={feature.desc}
				/>
			))}
		{selected ? (
			<Button style={buttonStyle} onClick={onDeselect}>
				Deselect
			</Button>
		) : (
			<Button style={buttonStyle} positive onClick={onSelect}>
				Select
			</Button>
		)}
	</div>
);

export default SubclassSelector;
