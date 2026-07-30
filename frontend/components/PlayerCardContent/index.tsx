import { PlayerStatsProps } from "@/types/playerCardTypes";
import { FC } from "react";
import styles from "./page.module.css";

export const PlayerCardContent: FC<PlayerStatsProps> = ({
  player,
  rank,
  onStatClick,
}) => {
  const { ptsDiff, rebDiff, astDiff, stlDiff } =
    player.sd_stats_difference_from_average;
  console.log(player);
  return (
    <div className={styles.cardContainer}>
      <h1 className={styles.rank}> Rank: {rank}</h1>
      <h1 className={styles.playerName}>
        {player.playerName} {" "}
        <span className={styles.playerPosition}>
          {player.stats.playerInfo.position}
        </span>
      </h1>
      <h1 className={styles.playerHeight}>
        Height: {player.stats.playerInfo.height}
      </h1>
      <h1 className={styles.playerTeam}>
        Team: {player.stats.playerInfo.teamAbbreviation}
      </h1>
      <h1 className={styles.playerCountry}>
        Country: {player.stats.playerInfo.country}
      </h1>
      <div className={styles.gameAverages}>
        <span>
          {" "}
          <span className={styles.averagesLabel}>Avg. Pts:</span>{" "}
          <span className={styles.averageStatValues}>
            {" "}
            {player.stats.pts}{" "}
          </span>{" "}
        </span>
        <span>
          {" "}
          <span className={styles.averagesLabel}>Avg. Reb:</span>{" "}
          <span className={styles.averageStatValues}>
            {" "}
            {player.stats.reb}{" "}
          </span>{" "}
        </span>
        <span>
          {" "}
          <span className={styles.averagesLabel}>Avg. Ast:</span>{" "}
          <span className={styles.averageStatValues}>
            {" "}
            {player.stats.ast}{" "}
          </span>{" "}
        </span>
        <span>
          {" "}
          <span className={styles.averagesLabel}>Avg. Stl:</span>{" "}
          <span className={styles.averageStatValues}>
            {" "}
            {player.stats.stl}{" "}
          </span>{" "}
        </span>
      </div>
      <div className={styles.sdGameAverages}>
        <span>
          {" "}
          <span className={styles.averagesLabel}>Avg. SD. Pts:</span>{" "}
          <span className={styles.averageStatValues}>
            {" "}
            {player.sd_game_averages_by_player.avgPts}{" "}
          </span>
          <span
            className={
              ptsDiff >= 0 ? styles.diffValuePositive : styles.diffValueNegative
            }
          >
            {ptsDiff > 0 ? <span>+</span> : <></>}
            {ptsDiff}
          </span>
        </span>
        <span>
          {" "}
          <span className={styles.averagesLabel}>Avg. SD. Reb:</span>{" "}
          <span className={styles.averageStatValues}>
            {" "}
            {player.sd_game_averages_by_player.avgReb}{" "}
          </span>
          <span
            className={
              rebDiff >= 0 ? styles.diffValuePositive : styles.diffValueNegative
            }
          >
            {rebDiff > 0 ? <span>+</span> : <></>}
            {rebDiff}
          </span>
        </span>
        <span>
          {" "}
          <span className={styles.averagesLabel}>Avg. SD. Ast:</span>{" "}
          <span className={styles.averageStatValues}>
            {" "}
            {player.sd_game_averages_by_player.avgAst}{" "}
          </span>
          <span
            className={
              astDiff >= 0 ? styles.diffValuePositive : styles.diffValueNegative
            }
          >
            {astDiff > 0 ? <span>+</span> : <></>}
            {astDiff}
          </span>
        </span>
        <span>
          {" "}
          <span className={styles.averagesLabel}>Avg. SD. Stl:</span>{" "}
          <span className={styles.averageStatValues}>
            {" "}
            {player.sd_game_averages_by_player.avgStl}{" "}
          </span>
          <span
            className={
              stlDiff >= 0 ? styles.diffValuePositive : styles.diffValueNegative
            }
          >
            {stlDiff >= 0 ? <span>+</span> : <></>}
            {stlDiff}
          </span>
        </span>
      </div>
      <div
        className={styles.playerGameText}
        onClick={() => onStatClick?.(player, "all")}
      >
        {" "}
        Games Two SD above average stats: {player.count}
      </div>
      <div
        className={styles.playerGameText}
        onClick={() => onStatClick?.(player, "points")}
      >
        {" "}
        Games Two SD above Points Average: {player.pts_match_count}
      </div>
      <div
        className={styles.playerGameText}
        onClick={() => onStatClick?.(player, "rebounds")}
      >
        {" "}
        Games Two SD above Rebounds Average: {player.reb_match_count}
      </div>
      <div
        className={styles.playerGameText}
        onClick={() => onStatClick?.(player, "assists")}
      >
        {" "}
        Games Two SD above Assists Average: {player.ast_match_count}
      </div>
      <div
        className={styles.playerGameText}
        onClick={() => onStatClick?.(player, "steals")}
      >
        {" "}
        Games Two SD above Steals Average: {player.stl_match_count}
      </div>
    </div>
  );
};
