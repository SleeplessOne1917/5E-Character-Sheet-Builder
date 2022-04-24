import { TouchEvent, TouchEventHandler, useEffect, useState } from "react";

import Link from "next/link";
import classes from "./SectionBar.module.css";

export enum Sections {
  "race",
  "class",
  "abilities",
  "description",
  "equipment",
  "finish",
}

const snapPercents = [0, 9, 20, 33, 50, 60];

const MAX_PERCENT = 60;

const capitalize = (str: string) => {
  const [first, ...rest] = str;
  return first.toUpperCase() + rest.join("").toLowerCase();
};

const getClosestToSnapPercent = (n: number): number => {
  const diffs = [];
  for (const snapPercent of snapPercents) {
    diffs.push({ diff: Math.abs(n - snapPercent), value: snapPercent });
  }

  diffs.sort((a, b) => {
    if (a.diff < b.diff) {
      return -1;
    } else if (b.diff < a.diff) {
      return 1;
    } else {
      return 0;
    }
  });

  return diffs[0].value;
};

const SectionBar = (): JSX.Element => {
  const [translatePercent, setTranslatePercent] = useState(0);
  const [x0, setX0] = useState(0);
  const [isMediumOrLarger, setIsMediumOrLarger] = useState(false);
  const [selectedSection, setSelectedSection] = useState(Sections[0]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsMediumOrLarger(mediaQuery.matches);
    mediaQuery.addEventListener("change", (event) =>
      setIsMediumOrLarger(event.matches)
    );
  }, []);

  const calculatePercent = (event: TouchEvent<HTMLUListElement>): number => {
    const dx = (event.changedTouches[0].clientX - x0) / 700;

    return Math.max(0, Math.min(translatePercent - dx, MAX_PERCENT));
  };

  const handleSwipe: TouchEventHandler<HTMLUListElement> = (
    event: TouchEvent<HTMLUListElement>
  ) => {
    setTranslatePercent(calculatePercent(event));
  };

  const handleTouchUp: TouchEventHandler<HTMLUListElement> = (
    event: TouchEvent<HTMLUListElement>
  ) => {
    const percent = calculatePercent(event);
    setTranslatePercent(getClosestToSnapPercent(percent));
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
        onTouchStart={(event) => setX0(event.changedTouches[0].clientX)}
        onTouchEnd={handleTouchUp}
        onTouchMove={handleSwipe}
      >
        {Object.keys(Sections)
          .filter((key) => isNaN(Number(key)))
          .map((key, index) => (
            <li key={key}>
              <Link href={`/create/${key}`}>
                <a
                  className={`${classes.link}${
                    key === selectedSection
                      ? ` ${classes["link-selected"]}`
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedSection(key);
                    setTranslatePercent(snapPercents[index]);
                  }}
                  style={
                    key === selectedSection
                      ? { transform: "translateY(0)" }
                      : {}
                  }
                >
                  {capitalize(key)}
                </a>
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default SectionBar;
