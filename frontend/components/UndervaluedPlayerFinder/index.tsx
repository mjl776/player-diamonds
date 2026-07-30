"use client";

import { FC, useEffect, useState } from "react";
import { PlayerObject } from "../../types/underValuedPlayerTypes";
import styles from "./page.module.css";
import { PlayerListRow } from "../PlayerListRow";
import { OptionSelectionToggleBar } from "../OptionSelectionToggleBar";
import { Season, Position } from "@/types/toggleOptionTypes";
import { PlayerCardCarousel } from "../PlayerCardCarousel";
import { API_BASE_URL } from "@/lib/api";
import { LoadingSpinner } from "../LoadingSpinner";
import { DEFAULT_POSITIONS_LIST, DEFAULT_SEASON_LIST } from "@/constants";
import { LeagueAverages } from "../LeagueAverages";
import { LeagueAveragesType } from "@/types/getLeagueAverages";

export const UndervaluedPlayerFinder: FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [selectedPositions, setSelectedPostions] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<Season[]>(DEFAULT_SEASON_LIST);
  const [positions, setPositions] = useState<Position[]>(
    DEFAULT_POSITIONS_LIST,
  );
  const [leagueAverages, setLeagueAverages] = useState<LeagueAveragesType[]>(
    [],
  );
  const [players, setPlayers] = useState<PlayerObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const onSelectedSeasonChange = (season: string) => {
    setSelectedSeason(season);
  };

  const onSelectedPositions = (position: string) => {
    console.log("Selected position:", selectedPositions);
    if (selectedPositions.includes(position)) {
      setSelectedPostions(selectedPositions.filter((p) => p !== position));
    } else {
      setSelectedPostions([...selectedPositions, position]);
    }
  };

  const fetchPlayers = async (season: string, positions: string[]) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("season", season);
      params.append("seasonType", "Regular Season");
      console.log("Selected positions:", positions);

      if (positions.length === 0) {
        params.append("positions", "all");
      } else {
        positions.forEach((position) => params.append("positions", position));
      }

      const response = await fetch(
        `${API_BASE_URL}/find-undervalued-players?${params.toString()}`,
      );
      const data = await response.json();
      setPlayers(data.players);
      setLeagueAverages(data.leagueAverages);
    } catch (error) {
      console.error("Error fetching undervalued players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAvailableSeasons = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/available-seasons`);
        const data = await response.json();
        setSeasons(data);
        console.log("Fetched available seasons:", data);
      } catch (error) {
        console.error("Error fetching available seasons:", error);
      }
    };
    fetchAvailableSeasons();
  }, []);

  useEffect(() => {
    const fetchAvailableSeasonTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/available-positions`);
        const data = await response.json();
        setPositions(data);
      } catch (error) {
        console.error("Error fetching available season types:", error);
      }
    };
    fetchAvailableSeasonTypes();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Undervalued Player Finder</h1>
      <div className={styles.descriptionContainer}>
        Select a season to find players who hit 2 standard deviations above
        their average statline most often across 4 key stat categories.
        Optionally filter by position — if none are selected, players are
        compared against overall position averages.
      </div>
      <OptionSelectionToggleBar
        seasons={seasons}
        positions={positions}
        selectedSeason={selectedSeason}
        selectedPositions={selectedPositions}
        onSelectedSeasonChange={onSelectedSeasonChange}
        onSelectedPosition={onSelectedPositions}
        onFindPlayersClick={fetchPlayers}
      />

      {!loading && leagueAverages && leagueAverages.length > 0 ? (
        <>
          <h1 className={styles.sectionHeader}> League Averages </h1>
          <div className={styles.descriptionContainer}>
            League averages by position for the selected regular season.
            Potentially undervalued players are compared against their
            position&apos;s averages, requiring at least 20 games played.
          </div>
          <LeagueAverages leagueAverages={leagueAverages} />
        </>
      ) : (
        <></>
      )}

      {!loading && players && players.length > 0 ? (
        <>
          <h1 className={styles.sectionHeader}> Top 3 undervalued players </h1>
          <div className={styles.descriptionContainer}>
            The 3 players who most often hit 2 standard deviations above their
            average statline this season. A + means the player outperformed that
            stat category&apos;s average; a - means they underperformed.
            &quot;Difference from average&quot; is how far a player&apos;s SD
            game average deviates from the group&apos;s SD game average.
          </div>
          <PlayerCardCarousel players={players.slice(0, 3)} />
        </>
      ) : (
        <LoadingSpinner isLoading={loading} text={"Finding Players"} />
      )}

      {!loading && players && players.length > 0 ? (
        <div className={styles.tableContainerWrapper}>
          <h1 className={styles.sectionHeader}>
            {" "}
            Table of All of Player Average Stats{" "}
          </h1>
          <div className={styles.tableDescriptionContainer}>
            All players who outperformed their average statline in Points,
            Assists, Rebounds, or Steals at least 5 times this season, sorted by
            how often they did so. Stats shown are their average across those
            outperforming games.
          </div>
          <table className={styles.tableContainer}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Name</th>
                <th className={styles.tableHeader}>Rank</th>
                <th className={styles.tableHeader}>GP</th>
                <th className={styles.tableHeader}>Min</th>
                <th className={styles.tableHeader}>Points</th>
                <th className={styles.tableHeader}>Assists</th>
                <th className={styles.tableHeader}>Rebounds</th>
                <th className={styles.tableHeader}>Steals</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {players.map((player: PlayerObject, index) => (
                <PlayerListRow
                  key={`player-composite-${index}`}
                  player={player}
                  rank={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
