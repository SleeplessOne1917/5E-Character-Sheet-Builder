import EquipmentView from '../../../../src/views/create/character/equipment/Equipment';
import { getEquipments } from '../../../../src/server/5E-API/srdClientService';

const EquipmentPage = async () => {
	const equipments = (await getEquipments()) ?? [];

	return <EquipmentView equipments={equipments} />;
};

export default EquipmentPage;
