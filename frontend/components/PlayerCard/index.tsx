import { PlayerStatsProps } from "@/types/playerCardTypes";
import styles from "./page.module.css";
import { FC } from "react";
import { PlayerCardContent } from "../PlayerCardContent";

export const PlayerCardComponent: FC<PlayerStatsProps> = ({
  player,
  rank,
  onStatClick,
}) => {
  return (
    <div className={styles.container}>
      <PlayerCardContent
        player={player}
        rank={rank}
        onStatClick={onStatClick}
      />
    </div>
  );
};
