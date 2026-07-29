import React, { FC } from "react";
import styles from './page.module.css';
import { GameLogsProps } from "@/types/gameLogsTypes";
import { PlayerGameLogObject } from "@/types/underValuedPlayerTypes";

export const GameLogsOverlay: FC<GameLogsProps> = ({ playerName, games, onClose }) => {
    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.playerGameCard} onClick={(e) => e.stopPropagation()}>
                <div className={styles.tableCaption}>{playerName} Game Logs</div>
                <div className={styles.tableContainerWrapper}>
                        <table className={styles.tableContainer}>
                            <thead>
                                <tr>
                                    <th className={styles.tableHeader}>Date</th>
                                    <th className={styles.tableHeader}>Min</th>
                                    <th className={styles.tableHeader}>Points</th>
                                    <th className={styles.tableHeader}>Assists</th>
                                    <th className={styles.tableHeader}>Rebounds</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                { games.length > 0 && games.map((game: PlayerGameLogObject, index) => (
                                    <tr key={`game-log-${index}`}>
                                        <td className={styles.tableCell}>{game.game_date}</td>
                                        <td className={styles.tableCell}>{game.min}</td>
                                        <td className={styles.tableCell}>{game.pts}</td>
                                        <td className={styles.tableCell}>{game.ast}</td>
                                        <td className={styles.tableCell}>{game.reb}</td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    );
}