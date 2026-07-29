'use client';

import { FC, useEffect, useState } from "react";
import { PlayerObject, PlayerStatsObject } from "../../types/underValuedPlayerTypes";
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

    const [selectedSeason, setSelectedSeason] = useState<string>('');
    const [selectedPositions, setSelectedPostions] = useState<string[]>([]);
    const [seasons, setSeasons] = useState<Season[]>(DEFAULT_SEASON_LIST);
    const [positions, setPositions] = useState<Position[]>(DEFAULT_POSITIONS_LIST);
    const [leagueAverages, setLeagueAverages] = useState<LeagueAveragesType[]>([]);
    const [players, setPlayers] = useState<PlayerObject[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const onSelectedSeasonChange = (season: string) => {
        setSelectedSeason(season);
    }

    const onSelectedPositions = (position: string) => {
        console.log('Selected position:', selectedPositions);
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
            params.append('season', season);
            params.append('seasonType', 'Regular Season');
            console.log('Selected positions:', positions);

            if (positions.length === 0) {
               params.append('positions', 'all');
            }
            else {
                positions.forEach(position => params.append('positions', position));
            }

            const response = await fetch(`${API_BASE_URL}/find-undervalued-players?${params.toString()}`);
            const data = await response.json();
            setPlayers(data.players);
            setLeagueAverages(data.leagueAverages);
        } catch (error) {
            console.error('Error fetching undervalued players:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchAvailableSeasons = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/available-seasons`)
                const data = await response.json();
                setSeasons(data);
                console.log('Fetched available seasons:', data);
            } catch (error) {
                console.error('Error fetching available seasons:', error);
            }
        }
        fetchAvailableSeasons();
    }, []);

    useEffect(() => {
        const fetchAvailableSeasonTypes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/available-positions`)
                const data = await response.json();
                setPositions(data);
            } catch (error) {
                console.error('Error fetching available season types:', error);
            }
        }
        fetchAvailableSeasonTypes();
    }, [])

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Undervalued Player Finder</h1>
            <div className={styles.descriptionContainer}>
                Welcome to the Undervalued Player Finder. Select the Season and it will return a list of players who performed 2
                standard deviations above their average statline in one or more of 4 key stat catergories the most times in the selected season. You can also select positions to filter the results by position.
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

            {
                !loading && leagueAverages && leagueAverages.length > 0 ? ( <>
                    <h1 className={styles.sectionHeader}> League Averages </h1>
                    <div className={styles.descriptionContainer}>
                        This is a the leagues averages for each position in the selected regular season of all players for each position.
                        Each player that is evaluated as potentally undervalued is compared to the league averages for their position in the selected season
                        and the query checks if the player has also played a minimum of 20 games in the selected season.
                    </div>
                    <LeagueAverages leagueAverages={leagueAverages} />
                    </>
                ) : <></>
            }

            {
                !loading && players && players.length > 0 ? (
                    <>
                        <h1 className={styles.sectionHeader}> Top 3 undervalued players </h1>
                        <div className={styles.descriptionContainer}>
                                The top 3 undervalued players are players who performed 2 standard deviations above their average statline in one or more of 4 key stat catergories
                                the most times in the selected season. The + sign indicates that the player performed above their average statline in that stat category, while the - sign indicates that the player performed below their average statline in that stat category.
                                The average of the SD game averages is calculated by taking the average of the player's SD game averages in each stat category.
                                The difference from the average is calculated by taking the difference between the player's SD game averages and the average of the SD game averages.
                        </div>
                        <PlayerCardCarousel players={players.slice(0,3)} />
                    </>) : (<LoadingSpinner isLoading={loading} text={'Finding Players'}/>)
            }

            { !loading && players && players.length > 0 ? (
            <div className={styles.tableContainerWrapper}>
                <h1 className={styles.sectionHeader}> Table of All of Player Average Stats </h1>
                <div className={styles.tableDescriptionContainer}>
                    This is a table of all the players who outperformed their average statline in one or more of 4 key stat catergories the most times in the selected season at least 5 times.
                    The table is sorted by the number of games the player outperformed their average statline in one or more of 4 key stat catergories.
                    The table displays the average statline of all the games they have outperformed at least 1 of the 4 statistical categories of
                    Points, Assists, Rebounds, and Steals.
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
                        { players.map((player: PlayerObject, index) => (
                            <PlayerListRow key={`player-composite-${index}`} player={player} rank={index + 1}/>
                        )) }
                    </tbody>
                </table>
            </div>
            ) : <></>
            }
        </div>
    )
}