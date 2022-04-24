import { SrdItem } from "../../../types/common";
import commonStyles from "../Create.module.css";

type ClassProps = {
  classes: SrdItem[];
};

const Class = ({ classes }: ClassProps): JSX.Element => (
  <main className={commonStyles.main}>
    <div className={commonStyles.content}>
      <ul>
        {classes.map((klass) => (
          <li key={klass.index}>{klass.name}</li>
        ))}
      </ul>
    </div>
  </main>
);

export default Class;
