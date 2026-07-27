import { PlayerStatsProps } from '@/types/playerCardTypes'
import styles from './page.module.css'
import { FC } from 'react'

export const PlayerCardComponent: FC<PlayerStatsProps>= ({ player, rank }) => {
    console.log(player)
    return (
        <div className={styles.container}>
            <div className={styles.cardContainer}>
                <h1 className={styles.rank}> Rank: { rank }</h1>
                <h1 className={styles.playerName}> { player.playerName }</h1>
                <div> Games Two SD above average statline:  { player.count }</div>
            </div>
        </div>
    )
}