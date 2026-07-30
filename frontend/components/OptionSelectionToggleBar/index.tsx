"use client";
import { FC, useEffect, useState } from "react";
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
  const [showSeasonWarning, setShowSeasonWarning] = useState<boolean>(false);

  useEffect(() => {
    if (selectedSeason) setShowSeasonWarning(false);
  }, [selectedSeason]);

  const handleFindPlayersClick = () => {
    if (!selectedSeason) {
      setShowSeasonWarning(true);
      return;
    }
    onFindPlayersClick(selectedSeason, selectedPositions);
  };

  return (
    <div className={styles.toggleBarContainer}>
      <div className={styles.seasonSelectionContainer}>
        <h1> Season </h1>
        <div
          className={
            showSeasonWarning
              ? `${styles.seasonButtonContainer} ${styles.seasonButtonContainerWarning}`
              : styles.seasonButtonContainer
          }
        >
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
      <div className={styles.findPlayersContainer}>
        {showSeasonWarning && (
          <div className={styles.seasonWarningText}>
            Please select a season first
          </div>
        )}
        <button
          className={styles.findPlayersButton}
          onClick={handleFindPlayersClick}
        >
          {" "}
          Find Players{" "}
        </button>
      </div>
    </div>
  );
};
