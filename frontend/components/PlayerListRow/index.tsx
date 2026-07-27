import { PlayerStatsProps } from '@/types/playerCardTypes'
import { FC } from 'react'
import styles from './page.module.css'

export const PlayerListRow: FC<PlayerStatsProps> = ({ player }) => {
    console.log(player);
    return (
        <tr className={styles.tableRow}>
            <td className={styles.tableData}>{player.playerName}</td>
            <td className={styles.tableData}>{player.stats.gp}</td>
            <td className={styles.tableData}>{player.stats.min}</td>
            <td className={styles.tableData}>{player.stats.pts}</td>
            <td className={styles.tableData}>{player.stats.ast}</td>
            <td className={styles.tableData}>{player.stats.reb}</td>
        </tr>
    )
}