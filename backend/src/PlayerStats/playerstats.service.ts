import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma.service';
import { PlayerLeagueAverages } from '../../generated/prisma/client';
import { FindUnderValuedPlayersQuery, PlayerSDGameStats, PlayerSDGameStatsQueryResult, StandDeviationResult } from './playerstats.models';
import { PlayerStats } from 'generated/prisma/client';

@Injectable()
export class PlayerStatsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getSeasonAverageStats(season: string, seasonType: string, position: string) {
    return await this.prisma.playerLeagueAverages.findFirst({
        where: { season: season, seasonType: seasonType, position: position},
    });
  }

  private async getAverageOrBelowAveragePlayers(season: string, seasonType: string, averagePlayerStats: PlayerLeagueAverages, position: string) {
    // Initially in our query use very basic
    // stats to find players who are below average or average players,
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


  private async getPlayersWithAboveStandardDeviation(season: string, seasonType: string, averageOrBelowAveragePlayers: PlayerStats[], playerstandardDeviationResults: StandDeviationResult[]) {

      // Get player threshold arrays for SD arrays for points, assists, and rebounds
      const { playerIds, ptsThresholds, astThresholds, rebThresholds } = this.getSDThresholds(averageOrBelowAveragePlayers, playerstandardDeviationResults);

      const games: PlayerSDGameStatsQueryResult[] = await this.prisma.$queryRaw `
      WITH thresholds AS (
          SELECT
            ${playerIds}::text[] AS playerIds,
            ${ptsThresholds}::int[] AS ptsThresholds,
            ${astThresholds}::int[] AS astThresholds,
            ${rebThresholds}::int[] AS rebThresholds
      ),
       matches as (
        SELECT
          g.*,
          u.ptsThreshold,
          u.astThreshold,
          u.rebThreshold,
          g.pts >= u.ptsThreshold AS pts_match,
          g.ast >= u.astThreshold AS ast_match,
          g.reb >= u.rebThreshold AS reb_match,
          COUNT(*) OVER (PARTITION BY g.player_id) AS match_count
        FROM thresholds
        JOIN LATERAL unnest(thresholds.ptsThresholds, thresholds.astThresholds, thresholds.rebThresholds, thresholds.playerIds)
          AS u(ptsThreshold, astThreshold, rebThreshold, player_id) ON true
        JOIN player_game_logs g ON g.player_id = u.player_id
        WHERE
          season = ${season}
          AND season_type = ${seasonType}
          AND (
            g.pts >= u.ptsThreshold
            OR
            g.ast >= u.astThreshold
            OR
            g.reb >= u.rebThreshold
        ))

        SELECT
          player_id as "playerId",
          player_name as "playerName",
          COUNT(*) AS match_count,
          json_agg(matches.* ORDER BY game_date) as player_game_logs
        FROM matches
        WHERE match_count >= 10
        GROUP BY player_id, player_name
    `;

    // Player id mapping from playerId to player
    const statsByPlayerId = new Map(
      averageOrBelowAveragePlayers.map(p => [p.playerId, p])
    );

    // For each player, find the games where they performed above their standard deviation for points, assists, and rebounds + averageOrBelowAveragePlayers points, assists, and rebounds
    const gamesAboveStandardDeviation: PlayerSDGameStats[] = games.map(row => ({
      playerName: row.playerName,
      stats: statsByPlayerId.get(row.playerId)!,
      player_game_logs: row.player_game_logs,
      count: Number(row.match_count),
    }));

    return gamesAboveStandardDeviation;

  }

  private getSDThresholds(averageOrBelowAveragePlayers: PlayerStats[], playerStandardDeviation: StandDeviationResult[]) {

    // Get the player ids of the players who are below average or average
    const eligiblePlayers = averageOrBelowAveragePlayers
    .map(player => {
      const sd = playerStandardDeviation.find(r => r.player_id === player.playerId);
      return sd ? { player, sd } : null;
    })
    .filter((entry): entry is { player: PlayerStats; sd: StandDeviationResult } => entry !== null);

    const playerIds = eligiblePlayers.map(({ player }) => player.playerId);

    const ptsThresholds = eligiblePlayers.map(({ player, sd }) =>
      player.pts.toNumber() + sd.standard_deviation_points.toNumber() * 2);

    const astThresholds = eligiblePlayers.map(({ player, sd }) =>
      player.ast.toNumber() + sd.standard_deviation_assists.toNumber() * 2);

    const rebThresholds = eligiblePlayers.map(({ player, sd }) =>
      player.reb.toNumber() + sd.standard_deviation_rebounds.toNumber() * 2);

    // Create standard deviation thresholds to show standard deviations of players
    // via the player_game_logs table for points, assists, and rebounds

      return {
        playerIds,
        ptsThresholds,
        astThresholds,
        rebThresholds,
      }
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
    const playerIds = averageOrBelowAveragePlayers.map(player => player.playerId);

    // Calculate the standard deviation of the stats for the players who are below average or average
    const calculateStandarDeviationOfPlayers = await this.calculateStandardDeviationOfPlayerStats(season, seasonType, playerIds);

    // For each player,
    // find the games where they
    // performed above their standard deviation for
    // points, assists, or rebounds
    // + averageOrBelowAveragePlayers points, assists, or rebounds
    // by 2 standard deviations
    const playesWithGamesAboveSD = await this.getPlayersWithAboveStandardDeviation(season, seasonType, averageOrBelowAveragePlayers, calculateStandarDeviationOfPlayers);

    // Sort the gamesAboveStandardDeviation array
    // by the count of games above standard deviation in ascending order
    playesWithGamesAboveSD.sort((a, b) => b.count - a.count);

    return {
      players: playesWithGamesAboveSD,
      playerCount: playesWithGamesAboveSD.length,
    };
  }

}