import ModalBackground from '../../ModalBackground/ModalBackground';

type HitPointsModalProps = {
	show: boolean;
};

const HitPointsModal = ({ show }: HitPointsModalProps) => {
	return (
		<ModalBackground testId="hit-points-modal" show={show}></ModalBackground>
	);
};

export default HitPointsModal;
