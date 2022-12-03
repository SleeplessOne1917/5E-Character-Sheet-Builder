'use client';

import Checkbox from '../../../../../Checkbox/Checkbox';
import { PartialBy } from '../../../../../../types/helpers';
import { TraitWithSubtraitsState } from '../../../../../../redux/features/editingRace';
import classes from './CheckboxDeck.module.css';

type CheckboxDeckProps = {
	trait: PartialBy<TraitWithSubtraitsState, 'subtraitOptions'>;
	onProficienciesCheck: (value: boolean) => void;
	onProficiencyOptionsCheck: (value: boolean) => void;
	onHPBonusCheck: (value: boolean) => void;
	onSpellsCheck: (value: boolean) => void;
	onSpellOptionsCheck: (value: boolean) => void;
	onSubtraitsCheck?: (value: boolean) => void;
};

const CheckboxDeck = ({
	trait,
	onHPBonusCheck,
	onProficienciesCheck,
	onProficiencyOptionsCheck,
	onSpellOptionsCheck,
	onSpellsCheck,
	onSubtraitsCheck
}: CheckboxDeckProps) => (
	<div className={classes['checkbox-deck']}>
		<Checkbox
			label="Proficiencies"
			checked={!!trait.proficiencies}
			onChange={onProficienciesCheck}
		/>
		<Checkbox
			label="Proficiency Options"
			checked={!!trait.proficiencyOptions}
			onChange={onProficiencyOptionsCheck}
		/>
		<Checkbox
			label="HP Bonus per Level"
			checked={trait.hpBonusPerLevel !== undefined}
			onChange={onHPBonusCheck}
		/>
		<Checkbox
			label="Spells"
			checked={!!trait.spells}
			onChange={onSpellsCheck}
		/>
		<Checkbox
			label="Spell Options"
			checked={!!trait.spellOptions}
			onChange={onSpellOptionsCheck}
		/>
		{onSubtraitsCheck && (
			<Checkbox
				label="Subtraits"
				checked={!!trait.subtraitOptions}
				onChange={onSubtraitsCheck}
			/>
		)}
	</div>
);

export default CheckboxDeck;
