import { PlayerCardProps } from '@/types/playerCardTypes'
import { FC } from 'react'
import styles from './page.module.css'

export const PlayerListRow: FC<PlayerCardProps> = ({ player }) => {
    return (
        <tr className={styles.tableRow}>
            <td className={styles.tableData}>{player.playerName}</td>
            <td className={styles.tableData}>{player.pts}</td>
            <td className={styles.tableData}>{player.ast}</td>
            <td className={styles.tableData}>{player.reb}</td>
        </tr>
    )
}