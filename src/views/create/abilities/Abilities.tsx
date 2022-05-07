import AbilityCalculation from '../../../components/character-creation/Abilities/AbilityCalculation';
import { AbilityItem } from '../../../types/srd';
import abilitiesClasses from './Abilities.module.css';
import commonClasses from '../../Views.module.css';

type AbilitiesProps = {
	abilities: AbilityItem[];
};

const Abilities = ({ abilities }: AbilitiesProps): JSX.Element => {
	return (
		<main className={commonClasses.main}>
			<div className={commonClasses.content}>
				<div className={abilitiesClasses['calculations-container']}>
					{abilities.map(ability => (
						<AbilityCalculation
							key={ability.index}
							index={ability.index}
							name={ability.full_name}
						/>
					))}
				</div>
			</div>
		</main>
	);
};

export default Abilities;
