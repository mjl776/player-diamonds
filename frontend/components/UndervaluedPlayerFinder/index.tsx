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

export const UndervaluedPlayerFinder: FC = () => {

    const [selectedSeason, setSelectedSeason] = useState<string>('');
    const [selectedPositions, setSelectedPostions] = useState<string[]>([]);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
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
            positions.forEach(position => params.append('positions', position));

            const response = await fetch(`${API_BASE_URL}/find-undervalued-players?${params.toString()}`);
            const data = await response.json();
            setPlayers(data.players);
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
                <p>
                    Welcome to the Undervalued Player Finder. Select the Season and Season Type and it will return a list of players who performed 2
                    standard deviations above their average statline
                </p>
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
                !loading && players && players.length > 0 ? (
                    <>
                        <h1 className={styles.sectionHeader}> Top 3 undervalued players </h1>
                        <PlayerCardCarousel players={players.slice(0,3)} />
                    </>) : (<LoadingSpinner isLoading={loading} text={'Finding Players'}/>)
            }

            { !loading && players && players.length > 0 ? (
            <div className={styles.tableContainerWrapper}>
                <h1 className={styles.sectionHeader}> Table of Rest of Players </h1>
                <table className={styles.tableContainer}>
                    <thead>
                        <tr>
                            <th className={styles.tableHeader}>Name</th>
                            <th className={styles.tableHeader}>GP</th>
                            <th className={styles.tableHeader}>Min</th>
                            <th className={styles.tableHeader}>Points</th>
                            <th className={styles.tableHeader}>Assists</th>
                            <th className={styles.tableHeader}>Rebounds</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        { players.map((player: PlayerObject, index) => (
                            <PlayerListRow key={`player-composite-${index}`} player={player} />
                        )) }
                    </tbody>
                </table>
            </div>
            ) : <></>
            }
        </div>
    )
}