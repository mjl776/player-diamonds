import { GameLogCategory, PlayerCaroselProps } from '@/types/playerCardTypes';
import { PlayerObject } from '@/types/underValuedPlayerTypes';
import styles from './page.module.css'
import { FC, useState } from 'react';
import { PlayerCardComponent } from '../PlayerCard';
import { GameLogsOverlay } from '../GameLogsOverlay';
import { CATEGORY_LABELS } from '@/constants';

export const PlayerCardCarousel: FC<PlayerCaroselProps> = ({ players }) => {
    const [selection, setSelection] = useState<{ player: PlayerObject; category: GameLogCategory } | null>(null);

    const activeGames = selection
        ? selection.category === 'all'
            ? selection.player.player_game_logs
            : selection.player.games_by_match_category[selection.category] ?? []
        : [];

    return (
        <div className={styles.carouselContainer}>
            {
                players.map((player, index) => (
                    <PlayerCardComponent
                        key={`player-card-${index}`}
                        player={player}
                        rank={index + 1}
                        onStatClick={(player, category) => setSelection({ player, category })}
                    />
                ))
            }
            {
                selection && (
                    <GameLogsOverlay
                        playerName={`${selection.player.playerName} - ${CATEGORY_LABELS[selection.category]}`}
                        games={activeGames}
                        onClose={() => setSelection(null)}
                    />
                )
            }
        </div>
    );
}