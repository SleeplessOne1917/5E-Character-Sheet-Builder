import EquipmentView from '../../../../src/views/create/character/equipment/Equipment';
import { getEquipments } from '../../../../src/graphql/srdClientService';

const EquipmentPage = async () => {
	const equipments = (await getEquipments()) ?? [];

	return <EquipmentView equipments={equipments} />;
};

export default EquipmentPage;
