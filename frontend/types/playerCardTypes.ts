import { PlayerObject } from "./underValuedPlayerTypes";

export type PlayerStatsProps = {
    player: PlayerObject;
    rank?: number;
}


export type PlayerCaroselProps = {
    players: PlayerObject[];
}