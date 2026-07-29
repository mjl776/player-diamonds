'use client'
import { PlayerStatsProps } from '@/types/playerCardTypes'
import { FC } from 'react'
import styles from './page.module.css'

export const PlayerListRow: FC<PlayerStatsProps> = ({ player, rank }) => {
    console.log(player.sd_game_averages_by_player);
    const { avgMin, avgPts, avgAst, avgReb, avgStl } = player.sd_game_averages_by_player;
    const { minDiff, ptsDiff, astDiff, rebDiff, stlDiff } = player.sd_stats_difference_from_average;
    return (
        <tr className={styles.tableRow}>
            <td className={styles.tableData}>{player.playerName}</td>
            <td className={styles.tableData}>{ rank }</td>
            <td className={styles.tableData}>{player.count}</td>
            <td className={styles.tableData}>{ avgMin } <span className={ minDiff >= 0 ? styles.positiveValue : styles.negativeValue}> {minDiff >= 0 ? <span>+</span> : <></>}{minDiff}</span></td>
            <td className={styles.tableData}>{ avgPts } <span className={ ptsDiff >= 0 ? styles.positiveValue : styles.negativeValue}> {ptsDiff >= 0 ? <span>+</span> : <></>}{ptsDiff}</span></td>
            <td className={styles.tableData}>{ avgAst } <span className={ astDiff >= 0 ? styles.positiveValue : styles.negativeValue}> {astDiff >= 0 ? <span>+</span> : <></>}{astDiff}</span></td>
            <td className={styles.tableData}>{ avgReb } <span className={ rebDiff >= 0 ? styles.positiveValue : styles.negativeValue}> {rebDiff >= 0 ? <span>+</span> : <></>}{rebDiff}</span></td>
            <td className={styles.tableData}>{ avgStl } <span className={ stlDiff >= 0 ? styles.positiveValue : styles.negativeValue}> {stlDiff >= 0 ? <span>+</span> : <></>}{stlDiff}</span></td>
        </tr>
    )
}