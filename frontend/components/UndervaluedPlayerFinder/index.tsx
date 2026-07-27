'use client';

import { FC, useEffect, useState } from "react";
import { PlayerObject, PlayerStatsObject } from "../../types/underValuedPlayerTypes";
import styles from "./page.module.css";
import { PlayerListRow } from "../PlayerListRow";
import { OptionSelectionToggleBar } from "../OptionSelectionToggleBar";
import { Season, SeasonType } from "@/types/toggleOptionTypes";
import { PlayerCardCarousel } from "../PlayerCardCarousel";

export const UndervaluedPlayerFinder: FC = () => {

    const [selectedSeason, setSelectedSeason] = useState<string>('');
    const [selectedSeasonType, setSelectedSeasonType] = useState<string>('');
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [seasonTypes, setSeasonTypes] = useState<SeasonType[]>([]);
    const [players, setPlayers] = useState<PlayerObject[]>([]);

    const onSelectedSeasonChange = (season: string) => {
        setSelectedSeason(season);
    }

    const onSelectSeasonType = (seasonType: string) => {
        setSelectedSeasonType(seasonType);
    }

    const fetchPlayers = async (season: string, seaonType: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/find-undervalued-players?season=${season}&seasonType=${seaonType}`);
            const data = await response.json();
            setPlayers(data.players);
        } catch (error) {
            console.error('Error fetching undervalued players:', error);
        }
    };

    useEffect(() => {
        const fetchAvailableSeasons = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/available-seasons`)
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/available-season-types`)
                const data = await response.json();
                setSeasonTypes(data);
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
                seasonTypes={seasonTypes}
                selectedSeason={selectedSeason}
                selectedSeasonType={selectedSeasonType}
                onSelectedSeasonChange={onSelectedSeasonChange}
                onSelectSeasonType={onSelectSeasonType}
                onFindPlayersClick={fetchPlayers}
            />

            {
                players && players.length > 0 && (
                    <>
                        <h1 className={styles.sectionHeader}> Top 3 undervalued players </h1>
                        <PlayerCardCarousel players={players.slice(0,3)} />
                    </>
                )
            }

            { players && players.length > 0 ? (
            <>
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
                    <tbody>
                        { players.map((player: PlayerObject, index) => (
                            <PlayerListRow key={`player-composite-${index}`} player={player} />
                        )) }
                    </tbody>
                </table>
            </>
            ) : <></>
            }
        </div>
    )
}