import { PlayerStatsProps } from '@/types/playerCardTypes'
import styles from './page.module.css'
import { FC } from 'react'

export const PlayerCardComponent: FC<PlayerStatsProps>= ({ player, rank, onStatClick }) => {

    return (
        <div className={styles.container}>
            <div className={styles.cardContainer}>
                <h1 className={styles.rank}> Rank: { rank }</h1>
                <h1 className={styles.playerName}> { player.playerName }</h1>
                <div className={styles.playerGameText} onClick={() => onStatClick?.(player, 'all')}> Games Two SD above average stats:  { player.count }</div>
                <div className={styles.playerGameText} onClick={() => onStatClick?.(player, 'points')}> Games Two SD above Points Average: { player.pts_match_count }</div>
                <div className={styles.playerGameText} onClick={() => onStatClick?.(player, 'rebounds')}> Games Two SD above Rebounds Average: { player.reb_match_count }</div>
                <div className={styles.playerGameText} onClick={() => onStatClick?.(player, 'assists')}> Games Two SD above Assists Average: { player.ast_match_count }</div>
                <div className={styles.playerGameText} onClick={() => onStatClick?.(player, 'steals')}> Games Two SD above Steals Average: { player.stl_match_count }</div>
            </div>
        </div>
    )
}