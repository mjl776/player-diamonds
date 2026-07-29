import { Decimal } from "@prisma/client/runtime/library";
import { PlayerStats, PlayerGameLogs } from "../../generated/prisma/client";
import { IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

// Cotroller query DTOs
export class FindUndervaluedPlayersQueryDto {
  @IsString()
  season: string;

  @IsString()
  seasonType: string;

  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @IsArray()
  @IsString({ each: true })
  positions: string[];
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

export type PlayerSDGameStats = {
    playerName: string;
    stats: PlayerStats;
    player_game_logs: PlayerSDGameStatsQueryResult[];
    count: number;
    ast_match_count: number;
    reb_match_count: number;
    stl_match_count: number;
    pts_match_count: number;
    games_by_match_category: Record<string, PlayerSDGameStatsQueryResult[]>;
}

export type PlayerSDGameStatsQueryResult =
    PlayerGameLogs & {
        pts_match: boolean;
        ast_match: boolean;
        reb_match: boolean;
        stl_match: boolean;
        pts_std_deviation: Decimal;
        match_count: number;
        player_game_logs: PlayerSDGameStatsQueryResult[];
        ast_match_count: number;
        reb_match_count: number;
        stl_match_count: number;
        pts_match_count: number;
    }

