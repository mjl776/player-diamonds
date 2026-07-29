import { PlayerObject } from "./underValuedPlayerTypes";

export type GameLogCategory = 'all' | 'points' | 'assists' | 'rebounds' | 'steals';

export type PlayerStatsProps = {
    player: PlayerObject;
    rank?: number;
    onStatClick?: (player: PlayerObject, category: GameLogCategory) => void;
}


export type PlayerCaroselProps = {
    players: PlayerObject[];
}