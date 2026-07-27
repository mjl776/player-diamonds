import { PlayerCaroselProps } from '@/types/playerCardTypes';
import styles from './page.module.css'
import { FC } from 'react';
import { PlayerCardComponent } from '../PlayerCard';

export const PlayerCardCarousel: FC<PlayerCaroselProps> = ({ players }) => {
    return (
        <div className={styles.carouselContainer}>
            {
                players.map((player, index) => (
                    <PlayerCardComponent key={`player-card-${index}`} player={player} rank={index+ 1}/>
                ))
            }
        </div>
    );
}