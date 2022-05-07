import { GetStaticPropsResult, NextPage } from 'next';

import EquipmentView from '../../src/views/create/equipment/Equipment';
import { SrdItem } from '../../src/types/srd';
import { getEquipments } from '../../src/graphql/srdClientService';

type EquipmentPageProps = {
	equipments: SrdItem[];
};

const EquipmentPage: NextPage<EquipmentPageProps> = ({
	equipments
}: EquipmentPageProps) => <EquipmentView equipments={equipments} />;

export default EquipmentPage;

export const getStaticProps = async (): Promise<
	GetStaticPropsResult<EquipmentPageProps>
> => {
	const equipments = await getEquipments();

	return { props: { equipments } };
};
