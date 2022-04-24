import { SrdItem } from "../../../types/common";
import commonClasses from "../Create.module.css";

type AbilitiesProps = {
  abilities: SrdItem[];
};

const Abilities = ({ abilities }: AbilitiesProps): JSX.Element => {
  return (
    <main className={commonClasses.main}>
      <div className={commonClasses.content}>
        <ul>
          {abilities.map((ability) => (
            <li key={ability.index}>{ability.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Abilities;
