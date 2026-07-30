import { PlayerObject } from "./underValuedPlayerTypes";

export type GameLogCategory =
  "all" | "points" | "assists" | "rebounds" | "steals";

export type PlayerStatsProps = {
  player: PlayerObject;
  rank?: number;
  onStatClick?: (player: PlayerObject, category: GameLogCategory) => void;
  onPlayerClick?: (player: PlayerObject) => void;
};

export type PlayerCaroselProps = {
  players: PlayerObject[];
};

export type PlayerCardOverlayProps = {
  player: PlayerObject;
  rank?: number;
  onClose: () => void;
};
