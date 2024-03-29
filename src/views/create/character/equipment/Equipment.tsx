'use client';

import GeneralInfoBar from '../../../../components/Create/Character/GeneralInfoBar/GeneralInfoBar';
import MainContent from '../../../../components/MainContent/MainContent';
import { SrdItem } from '../../../../types/srd';

type EquipmentProps = {
	equipments: SrdItem[];
};

const Equipment = ({ equipments }: EquipmentProps): JSX.Element => {
	return (
		<MainContent>
			<GeneralInfoBar />
			<ul>
				{equipments.map(equipment => (
					<li key={equipment.index}>{equipment.name}</li>
				))}
			</ul>
		</MainContent>
	);
};

export default Equipment;
