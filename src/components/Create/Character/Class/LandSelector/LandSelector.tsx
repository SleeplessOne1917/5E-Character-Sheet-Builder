'use client';

import { Land } from '../../../../../types/land';
import Select from '../../../../Select/Select/Select';
import classes from './LandSelector.module.css';

type LandSelectorProps = {
	value: null | Land;
	onChange: (value: Land | null) => void;
};

const LandSelector = ({ value, onChange }: LandSelectorProps) => (
	<div
		data-testid="land-selector"
		className={`${classes.container}${value ? ` ${classes.selected}` : ''}`}
	>
		<Select
			id="select-land"
			labelFontSize="1.3rem"
			label="Select Land"
			options={[
				{ value: 'blank', label: '\u2014' },
				{ value: 'arctic', label: 'Arctic' },
				{ value: 'coast', label: 'Coast' },
				{ value: 'desert', label: 'Desert' },
				{ value: 'forest', label: 'Forest' },
				{ value: 'grassland', label: 'Grassland' },
				{ value: 'mountain', label: 'Mountain' },
				{ value: 'swamp', label: 'Swamp' }
			]}
			value={value === null ? 'blank' : value}
			onChange={value => onChange(value === 'blank' ? null : (value as Land))}
		/>
	</div>
);

export default LandSelector;
