import { FC, useState } from "react";
import styles from "./page.module.css";
import { GameLogCategory, PlayerCardOverlayProps } from "@/types/playerCardTypes";
import { PlayerCardContent } from "../PlayerCardContent";
import { GameLogsOverlay } from "../GameLogsOverlay";
import { CATEGORY_LABELS } from "@/constants";

export const PlayerCardOverlay: FC<PlayerCardOverlayProps> = ({
  player,
  rank,
  onClose,
}) => {
  const [statCategory, setStatCategory] = useState<GameLogCategory | null>(
    null,
  );

  const activeGames = statCategory
    ? statCategory === "all"
      ? player.player_game_logs
      : (player.games_by_match_category[statCategory] ?? [])
    : [];

  return (
    <>
      <div className={styles.backdrop} onClick={onClose}>
        <div className={styles.cardWrapper} onClick={(e) => e.stopPropagation()}>
          <PlayerCardContent
            player={player}
            rank={rank}
            onStatClick={(_, category) => setStatCategory(category)}
          />
        </div>
      </div>
      {statCategory && (
        <GameLogsOverlay
          playerName={`${player.playerName} - ${CATEGORY_LABELS[statCategory]}`}
          games={activeGames}
          onClose={() => setStatCategory(null)}
        />
      )}
    </>
  );
};
