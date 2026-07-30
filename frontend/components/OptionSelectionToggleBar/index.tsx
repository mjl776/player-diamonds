"use client";
import { FC } from "react";
import styles from "./page.module.css";
import "./page.module.css";
import { OptionSelectionToggleBarProps } from "@/types/toggleOptionTypes";

export const OptionSelectionToggleBar: FC<OptionSelectionToggleBarProps> = ({
  seasons,
  positions,
  selectedSeason,
  selectedPositions,
  onSelectedSeasonChange,
  onSelectedPosition,
  onFindPlayersClick,
}) => {
  return (
    <div className={styles.toggleBarContainer}>
      <div className={styles.seasonSelectionContainer}>
        <h1> Season </h1>
        <div className={styles.seasonButtonContainer}>
          {seasons &&
            seasons.map((season, index) => {
              const isActive = selectedSeason == season.season;
              return (
                <button
                  key={`season-${index}`}
                  className={
                    isActive
                      ? styles.seasonButtontoggleOptionActive
                      : styles.seasonButtontoggleOption
                  }
                  onClick={() => onSelectedSeasonChange(season.season)}
                  onDoubleClick={() => isActive && onSelectedSeasonChange("")}
                >
                  {season.season}
                </button>
              );
            })}
        </div>
      </div>
      <div className={styles.seasonSelectionContainer}>
        <h1 className={styles.seasonsHeader}> Positions </h1>
        <div className={styles.seasonButtonContainer}>
          {positions &&
            positions.map((position, index) => {
              const isActive = selectedPositions.includes(position.position);
              return (
                <button
                  key={`position-${index}`}
                  className={
                    isActive
                      ? styles.seasonButtontoggleOptionActive
                      : styles.seasonButtontoggleOption
                  }
                  onClick={() => onSelectedPosition(position.position)}
                  onDoubleClick={() =>
                    isActive && onSelectedPosition(position.position)
                  }
                >
                  {position.position}
                </button>
              );
            })}
        </div>
      </div>
      <button
        className={styles.findPlayersButton}
        onClick={() => onFindPlayersClick(selectedSeason, selectedPositions)}
      >
        {" "}
        Find Players{" "}
      </button>
    </div>
  );
};
