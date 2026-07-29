import { PlayerGameLogObject } from "./underValuedPlayerTypes";

export type GameLogsProps = {
    playerName: string;
    games: PlayerGameLogObject[];
    onClose?: () => void;
}