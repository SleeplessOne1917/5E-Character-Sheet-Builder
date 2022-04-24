import { SrdItem } from "../../../types/common";
import commonClasses from "../Create.module.css";

type RaceProps = {
  races: SrdItem[];
};

const Race = ({ races }: RaceProps): JSX.Element => {
  return (
    <main className={commonClasses.main}>
      <div className={commonClasses.content}>
        <ul>
          {races.map((race) => (
            <li key={race.index}>{race.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Race;
