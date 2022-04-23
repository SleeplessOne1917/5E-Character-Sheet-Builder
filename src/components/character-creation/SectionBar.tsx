import { TouchEvent, TouchEventHandler, useState } from "react";

import Link from "next/link";
import classes from "./SectionBar.module.css";

const createSections = {
  race: "Race",
  class: "Class",
  abilities: "Abilities",
  description: "Description",
  equipment: "Equipment",
  finish: "Finish",
};

const SectionBar = (): JSX.Element => {
  const [translatePercent, setTranslatePercent] = useState(0);
  const [x0, setx0] = useState(0);
  let isMediumOrLarger = false;
  if (typeof window !== "undefined") {
    isMediumOrLarger = window?.matchMedia("(min-width: 768px)").matches;
  }

  const setSnapPercent = (index: number) => {
    console.log(index);
    if (index === 3) {
      setTranslatePercent(index * 10 + 6);
    } else if (index >= 4) {
      setTranslatePercent((index + 1) * 10);
    } else {
      setTranslatePercent(index * 10);
    }
  };

  const swipe: TouchEventHandler<HTMLUListElement> = (
    event: TouchEvent<HTMLUListElement>
  ) => {
    const dx = -(event.changedTouches[0].clientX - x0);

    const percent = Math.max(0, Math.min(dx, 60));
    setTranslatePercent(percent);
  };

  return (
    <nav className={classes["section-bar"]}>
      <ul
        className={classes["section-list"]}
        style={
          isMediumOrLarger
            ? {}
            : {
                transform: `translateX(-${translatePercent}%)`,
              }
        }
        onTouchStart={(event) => setx0(event.changedTouches[0].clientX)}
        onTouchEnd={swipe}
        onTouchMove={swipe}
      >
        {Object.entries(createSections).map(([key, value], index) => (
          <li key={key}>
            <Link href={`/create/race#`}>
              <a className={classes.link} onClick={() => setSnapPercent(index)}>
                {value}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SectionBar;
