import { SrdItem } from "../../../types/common";
import commonClasses from "../Create.module.css";

type EquipmentProps = {
  equipments: SrdItem[];
};

const Equipment = ({ equipments }: EquipmentProps): JSX.Element => {
  return (
    <main className={commonClasses.main}>
      <div className={commonClasses.content}>
        <ul>
          {equipments.map((equipment) => (
            <li key={equipment.index}>{equipment.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Equipment;
