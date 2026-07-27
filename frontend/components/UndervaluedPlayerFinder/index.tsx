'use client';

import { FC, useEffect, useState } from "react";
import { PlayerStatsObject } from "../../types/underValuedPlayerTypes";
import styles from "./page.module.css";
import { PlayerListRow } from "../PlayerListRow";
import { OptionSelectionToggleBar } from "../OptionSelectionToggleBar";

export const UndervaluedPlayerFinder: FC = () => {

    const [players, setPlayers] = useState<PlayerStatsObject[]>([]);
    const season = "2025-26"
    const seasonType = "Regular Season"
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/find-undervalued-players?season=${season}&seasonType=${seasonType}`);
                const data = await response.json();
                console.log('Fetched undervalued players:', data);
            } catch (error) {
                console.error('Error fetching undervalued players:', error);
            }
        };

        fetchPlayers();
    }, [season, seasonType]);

    return (
        <div className={styles.container}>
            <h1>Undervalued Player Finder</h1>
            <p>This is the Undervalued Player Finder page.</p>
            <OptionSelectionToggleBar />
            <table className={styles.tableContainer}>
                <thead>
                    <tr>
                        <th className={styles.tableHeader}>Name</th>
                        <th className={styles.tableHeader}>Points</th>
                        <th className={styles.tableHeader}>Assists</th>
                        <th className={styles.tableHeader}>Rebounds</th>
                    </tr>
                </thead>
                <tbody>
                    {players && players.map((player: any) => (
                        <PlayerListRow key={player.id} player={player} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}