import { useAppSelector } from '../../../../../hooks/reduxHooks';
import { Terrain } from '../../../../../types/srd';
import Select from '../../../../Select/Select/Select';
import classes from './FavoredTerrainSelector.module.css';

type FavoredTerrainSelectorProps = {
	value: Terrain | null;
	onChange: (value: Terrain | null) => void;
};

const FavoredTerrainSelector = ({
	value,
	onChange
}: FavoredTerrainSelectorProps) => {
	const selectedTerrains = useAppSelector(
		state => state.editingCharacter.classInfo.favoredTerrains
	);

	return (
		<div
			className={`${classes.container}${value ? ` ${classes.selected}` : ''}`}
			data-testid="favored-terrain-selector"
		>
			<Select
				id="select-terrain"
				labelFontSize="1.3rem"
				label="Select Terrain"
				options={[
					{ value: 'blank', label: '\u2014' },
					{ value: 'arctic', label: 'Arctic' },
					{ value: 'coast', label: 'Coast' },
					{ value: 'desert', label: 'Desert' },
					{ value: 'forest', label: 'Forest' },
					{ value: 'grassland', label: 'Grassland' },
					{ value: 'swamp', label: 'Swamp' }
				].filter(
					option =>
						!selectedTerrains?.includes(option.value as Terrain) ||
						(option.value as Terrain) === value
				)}
				onChange={value =>
					onChange(value === 'blank' ? null : (value as Terrain))
				}
				value={value === null ? 'blank' : value}
			/>
		</div>
	);
};

export default FavoredTerrainSelector;
