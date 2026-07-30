import { FC } from "react";
import { LeagueAveragesProps } from "../../types/getLeagueAverages";
import styles from "./page.module.css";

export const LeagueAverages: FC<LeagueAveragesProps> = ({ leagueAverages }) => {
  return (
    <div className={styles.container}>
      {leagueAverages &&
        leagueAverages.map((average, index) => (
          <div
            key={`league-averages-${index}`}
            className={styles.leagueAveragesCard}
          >
            <div className={styles.averages}>
              {" "}
              Average for Position:{" "}
              <span className={styles.averagesValue}>{average.position}</span>
            </div>
            <div className={styles.averages}>
              {" "}
              Games Played:{" "}
              <span className={styles.averagesValue}>{average.gp}</span>{" "}
            </div>
            <div className={styles.averages}>
              {" "}
              Minutes:{" "}
              <span className={styles.averagesValue}>{average.min}</span>
            </div>
            <div className={styles.averages}>
              {" "}
              Points:{" "}
              <span className={styles.averagesValue}>{average.pts} </span>
            </div>
            <div className={styles.averages}>
              {" "}
              Rebounds:{" "}
              <span className={styles.averagesValue}>{average.reb}</span>
            </div>
            <div className={styles.averages}>
              {" "}
              Assists:{" "}
              <span className={styles.averagesValue}>{average.ast}</span>
            </div>
            <div className={styles.averages}>
              {" "}
              Steals:{" "}
              <span className={styles.averagesValue}>{average.stl}</span>
            </div>
          </div>
        ))}
    </div>
  );
};
