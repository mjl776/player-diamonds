import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma.service';
import { PlayerLeagueAverages } from '../../generated/prisma/client';
import { FindUnderValuedPlayersQuery, StandDeviationResult } from './playerstats.models';
import { PlayerGameLogs, PlayerStats } from 'generated/prisma/browser';
import { isDataView } from 'node:util/types';

@Injectable()
export class PlayerStatsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getSeasonAverageStats(season: string, seasonType: string, position: string) {
    return await this.prisma.playerLeagueAverages.findFirst({
        where: { season: season, seasonType: seasonType, position: position},
    });
  }

  private async getAverageOrBelowAveragePlayers(season: string, seasonType: string, averagePlayerStats: PlayerLeagueAverages, position: string) {
    // Initially in our query use very basic stats to find players who are below average or average players,
    // Then we can add more advanced stats to the query later
    return await this.prisma.playerStats.findMany({
        where: {
            playerInfo: {
              position: position,
            },
            season: season,
            seasonType: seasonType,
            gp: { gte: 20 }, // Only consider players who have played at least 20 games
            reb: { lte: averagePlayerStats.reb},
            ast: { lte: averagePlayerStats.ast },
            pts: { lte: averagePlayerStats.pts },
        },
    });
  }

  private async calculateStandardDeviationOfPlayerStats(season: string, seasonType: string, playerIds: string[]): Promise<StandDeviationResult[]> {
      // calcuate the standard deviation of the stats for the players who are below average or average
      return await this.prisma.$queryRaw
      `
        SELECT
          player_id,
          player_name,
          stddev_samp(pts) AS standard_deviation_points,
          stddev_samp(ast) AS standard_deviation_assists,
          stddev_samp(reb) AS standard_deviation_rebounds,
          stddev_samp(oreb) AS standard_deviation_offensive_rebounds,
          stddev_samp(dreb) AS standard_deviation_defensive_rebounds,
          stddev_samp(min) AS standard_deviation_minutes,
          stddev_samp(fgm) AS standard_deviation_field_goals_made,
          stddev_samp(fga) AS standard_deviation_field_goals_attempted,
          stddev_samp(fg_pct) AS standard_deviation_field_goal_percentage,
          stddev_samp(fg3m) AS standard_deviation_three_point_made,
          stddev_samp(fg3a) AS standard_deviation_three_point_attempted,
          stddev_samp(fg3_pct) AS standard_deviation_three_point_percentage,
          stddev_samp(ftm) AS standard_deviation_free_throws_made,
          stddev_samp(fta) AS standard_deviation_free_throws_attempted,
          stddev_samp(ft_pct) AS standard_deviation_free_throw_percentage,
          stddev_samp(stl) AS standard_deviation_steals,
          stddev_samp(blk) AS standard_deviation_blocks,
          stddev_samp(tov) AS standard_deviation_turnovers,
          stddev_samp(pf) AS standard_deviation_personal_fouls,
          stddev_samp(plus_minus) AS standard_deviation_plus_minus
        FROM "player_game_logs"
        WHERE player_id = ANY(${playerIds}::text[]) AND season = ${season} AND season_type = ${seasonType}
        GROUP BY player_id, player_name;
      `;
  }

  private async getGamesAboveStandardDeviationOfPlayers(season: string, seasonType: string, averageOrBelowAveragePlayers: PlayerStats[], playerstandardDeviationResults: StandDeviationResult[]) {
    // For each player, find the games where they performed above their standard deviation for points, assists, and rebounds + averageOrBelowAveragePlayers points, assists, and rebounds
    const gamesAboveStandardDeviation: PlayerGameLogs[] = [];
    for (const player of averageOrBelowAveragePlayers) {
      const playerStandardDeviation = playerstandardDeviationResults.find(result => result.player_id === player.playerId);
      if (!playerStandardDeviation) {
        continue;
      }

      const games: PlayerGameLogs[] = await this.prisma.$queryRaw`
        SELECT *,
          (pts >= ${player.pts.toNumber()} + COALESCE(${playerStandardDeviation.standard_deviation_points.mul(2)}, 0)) AS pts_match,
          (ast >= ${player.ast.toNumber()} + COALESCE(${playerStandardDeviation.standard_deviation_assists.mul(2)}, 0)) AS ast_match,
          (reb >= ${player.reb.toNumber()} + COALESCE(${playerStandardDeviation.standard_deviation_rebounds.mul(2)}, 0)) AS reb_match,
          (pts >= ${player.pts.toNumber()} + COALESCE(${playerStandardDeviation.standard_deviation_points.mul(2)}, 0))::int
          + (ast >= ${player.ast.toNumber()} + COALESCE(${playerStandardDeviation.standard_deviation_assists.mul(2)}, 0))::int
          + (reb >= ${player.reb.toNumber()} + COALESCE(${playerStandardDeviation.standard_deviation_rebounds.mul(2)}, 0))::int
          AS match_count
        FROM "player_game_logs"Is 
        FROM "player_game_logs"
        WHERE player_id = ${player.playerId}
          AND season = ${season}
          AND season_type = ${seasonType}
          AND (
            pts >= ${player.pts.toNumber()} + COALESCE(${playerStandardDeviation.standard_deviation_points.mul(2)}, 0)
            OR
            ast >= ${player.ast.toNumber()} + COALESCE(${playerStandardDeviation.standard_deviation_assists.mul(2)}, 0)
            OR
            reb >= ${player.reb.toNumber()} + COALESCE(${playerStandardDeviation.standard_deviation_rebounds.mul(2)}, 0)
          )
        GROUP BY id, player_id, pts, ast, reb
      `;

      gamesAboveStandardDeviation.push(...games);
    }

    return gamesAboveStandardDeviation;
  }


  async findUndervaluedPlayers({
    season,
    seasonType,
  }: FindUnderValuedPlayersQuery) {

    // Find the average stats for the given season and season type
    const averagePlayerStatsGuard = await this.getSeasonAverageStats(season, seasonType, "G");
    const averagePlayerStatsForward = await this.getSeasonAverageStats(season, seasonType, "F");
    const averagePlayerStatsCenter = await this.getSeasonAverageStats(season, seasonType, "C");

    if (!averagePlayerStatsCenter || !averagePlayerStatsForward || !averagePlayerStatsGuard) {
        throw new Error(`No average stats found for season ${season} and season type ${seasonType}`);
    };

    // Find all postions whose stats are at or below average and compare against their perspective position class
    const averageOrBelowAverageGuards = await this.getAverageOrBelowAveragePlayers(season, seasonType, averagePlayerStatsGuard, "G");
    const averageOrBelowAverageForwards = await this.getAverageOrBelowAveragePlayers(season, seasonType, averagePlayerStatsForward, "F");
    const averageOrBelowAverageCenters = await this.getAverageOrBelowAveragePlayers(season, seasonType, averagePlayerStatsCenter, "C");

    // Combine all the results into a single array
    const averageOrBelowAveragePlayers = [
        ...averageOrBelowAverageGuards,
        ...averageOrBelowAverageForwards,
        ...averageOrBelowAverageCenters,
    ];

    // Get the player ids of the players who are below average or average
    const playerIds: string[] = averageOrBelowAveragePlayers.map(player => player.playerId);

    // Calculate the standard deviation of the stats for the players who are below average or average
    const calculateStandarDeviationOfPlayers = await this.calculateStandardDeviationOfPlayerStats(season, seasonType, playerIds);

    // For each player, find the games where they performed above their standard deviation for points, assists, and rebounds + averageOrBelowAveragePlayers points, assists, and rebounds
    const gamesAboveStandardDeviation = await this.getGamesAboveStandardDeviationOfPlayers(season, seasonType, averageOrBelowAveragePlayers, calculateStandarDeviationOfPlayers);
    console.log("gamesAboveStandardDeviation", gamesAboveStandardDeviation);

    return averageOrBelowAveragePlayers.length;
  }

}