import { GameLogCategory } from "@/types/playerCardTypes";
import { Position, Season } from "@/types/toggleOptionTypes";

export const DEFAULT_POSITIONS_LIST: Position[] = [{position:'G'}, {position:'F'}, {position:'C'}];
export const DEFAULT_SEASON_LIST: Season[] = [{season: '2025-26'}]

export const CATEGORY_LABELS: Record<GameLogCategory, string> = {
    all: 'Game Logs',
    points: 'Points Games',
    assists: 'Assists Games',
    rebounds: 'Rebounds Games',
    steals: 'Steals Games',
};