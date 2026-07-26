import { Decimal } from "@prisma/client/runtime/library";
import { PlayerGameLogs } from "generated/prisma/browser";

// Controller Types
export type FindUnderValuedPlayersQuery = {
    season: string;
    seasonType: string;
}

// Service types
export type StandDeviationResult = {
    player_id: string;
    player_name: string;
    standard_deviation_points: Decimal;
    standard_deviation_assists: Decimal;
    standard_deviation_rebounds: Decimal;
    standard_deviation_offensive_rebounds: Decimal;
    standard_deviation_defensive_rebounds: Decimal;
    standard_deviation_minutes: Decimal;
    standard_deviation_field_goals_made: Decimal;
    standard_deviation_field_goals_attempted: Decimal;
    standard_deviation_field_goal_percentage: Decimal;
    standard_deviation_three_point_made: Decimal;
    standard_deviation_three_point_attempted: Decimal;
    standard_deviation_three_point_percentage: Decimal;
    standard_deviation_free_throws_made: Decimal;
    standard_deviation_free_throws_attempted: Decimal;
    standard_deviation_free_throw_percentage: Decimal;
    standard_deviation_steals: Decimal;
    standard_deviation_blocks: Decimal;
    standard_deviation_turnovers: Decimal;
    standard_deviation_personal_fouls: Decimal;
    standard_deviation_plus_minus: Decimal;
}

export type PlayerGameStats = {
    player_game_logs: PlayerGameLogs,
    stat_match: string;
}