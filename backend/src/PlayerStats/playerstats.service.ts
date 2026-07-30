import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma.service';
import {
  PlayerLeagueAverages,
  PlayerStats,
} from '../../generated/prisma/client';
import {
  PlayerSDGameStats,
  PlayerSDGameStatsQueryResult,
  StandDeviationResult,
  FindUndervaluedPlayersQueryDto,
} from './playerstats.models';
import { Decimal } from '@prisma/client/runtime/index-browser';
import { min } from 'class-validator';

@Injectable()
export class PlayerStatsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getSeasonAverageStats(
    season: string,
    seasonType: string,
    position: string,
  ) {
    return await this.prisma.playerLeagueAverages.findFirst({
      where: { season: season, seasonType: seasonType, position: position },
    });
  }

  private async getLeagueAllAveragesByPosition(
    season: string,
    seasonType: string,
    position: string,
  ) {
    return await this.prisma.playerLeagueAverages.findFirst({
      where: { season: season, seasonType: seasonType, position: position },
    });
  }

  private async getAverageOrBelowAveragePlayers(
    season: string,
    seasonType: string,
    averagePlayerStats: PlayerLeagueAverages,
    position: string,
  ) {
    // Initially in our query use very basic
    // stats to find players who are below average or average players,
    // Then we can add more advanced stats to the query later
    return await this.prisma.playerStats.findMany({
      where: {
        playerInfo:
          position === 'all'
            ? undefined
            : {
                position: position,
              },
        season: season,
        seasonType: seasonType,
        gp: { gte: 20 }, // Only consider players who have played at least 20 games
        reb: { lte: averagePlayerStats.reb },
        ast: { lte: averagePlayerStats.ast },
        pts: { lte: averagePlayerStats.pts },
      },
      include: {
        playerInfo: {
          select: {
            position: true,
            height: true,
            teamAbbreviation: true,
            country: true,
          },
        },
      },
    });
  }

  private async calculateStandardDeviationOfPlayerStats(
    season: string,
    seasonType: string,
    playerIds: string[],
  ): Promise<StandDeviationResult[]> {
    // calcuate the standard deviation of the stats for the players who are below average or average
    return await this.prisma.$queryRaw`
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

  private async getPlayersWithAboveStandardDeviation(
    season: string,
    seasonType: string,
    averageOrBelowAveragePlayers: PlayerStats[],
    playerstandardDeviationResults: StandDeviationResult[],
  ) {
    // Get player threshold arrays for SD arrays for points, assists, and rebounds
    const {
      playerIds,
      ptsThresholds,
      astThresholds,
      rebThresholds,
      stlsThresholds,
    } = this.getSDThresholds(
      averageOrBelowAveragePlayers,
      playerstandardDeviationResults,
    );

    const games: PlayerSDGameStatsQueryResult[] = await this.prisma.$queryRaw`
      WITH thresholds AS (
          SELECT
            ${playerIds}::text[] AS playerIds,
            ${ptsThresholds}::float8[] AS ptsThresholds,
            ${astThresholds}::float8[] AS astThresholds,
            ${rebThresholds}::float8[] AS rebThresholds,
            ${stlsThresholds}::float8[] AS stlsThresholds
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
          g.stl >= u.stlsThreshold AS stl_match,
          COUNT(*) OVER (PARTITION BY g.player_id) AS match_count
        FROM thresholds
        JOIN LATERAL unnest(thresholds.ptsThresholds, thresholds.astThresholds, thresholds.rebThresholds, thresholds.stlsThresholds, thresholds.playerIds)
          AS u(ptsThreshold, astThreshold, rebThreshold, stlsThreshold, player_id) ON true
        JOIN player_game_logs g ON g.player_id = u.player_id
        WHERE
          season = ${season}
          AND season_type = ${seasonType}
          AND g.min >= 10
          AND (
            g.pts >= u.ptsThreshold
            OR
            g.ast >= u.astThreshold
            OR
            g.reb >= u.rebThreshold
            OR
            g.stl >= u.stlsThreshold
        ))

        SELECT
          player_id as "playerId",
          player_name as "playerName",
          COUNT(*) AS match_count,
          COUNT(*) FILTER (WHERE ast_match) AS ast_match_count,
          COUNT(*) FILTER (WHERE pts_match) AS pts_match_count,
          COUNT(*) FILTER (WHERE reb_match) AS reb_match_count,
          COUNT(*) FILTER (WHERE stl_match) AS stl_match_count,
          AVG(min) AS avg_min,
          AVG(pts) AS avg_pts,
          AVG(ast) AS avg_ast,
          AVG(reb) AS avg_reb,
          AVG(stl) AS avg_stl,
          json_agg(matches.* ORDER BY game_date) as player_game_logs
        FROM matches
        WHERE match_count >= 5
        GROUP BY player_id, player_name
    `;

    // Player id mapping from playerId to player
    const statsByPlayerId = new Map(
      averageOrBelowAveragePlayers.map((p) => [p.playerId, p]),
    );

    // For each player, find the games where they performed above their standard deviation for points, assists, and rebounds + averageOrBelowAveragePlayers points, assists, and rebounds
    const gamesAboveStandardDeviation: PlayerSDGameStats[] = games.map(
      (row) => ({
        playerName: row.playerName,
        stats: statsByPlayerId.get(row.playerId)!,
        player_game_logs: row.player_game_logs,
        count: Number(row.match_count),
        ast_match_count: Number(row.ast_match_count),
        pts_match_count: Number(row.pts_match_count),
        reb_match_count: Number(row.reb_match_count),
        stl_match_count: Number(row.stl_match_count),
        games_by_match_category: this.getSDGamesByMatchCategoryGames(
          row.player_game_logs,
        ),
        sd_game_averages_by_player: this.getSDGameAveragesByPlayer(
          row.avg_min,
          row.avg_pts,
          row.avg_stl,
          row.avg_ast,
          row.avg_reb,
        ),
        sd_stats_difference_from_average:
          this.getDifferenceBetweenPlayerStatsAndAverageSDStats(
            statsByPlayerId.get(row.playerId)!,
            {
              min: row.avg_min,
              pts: row.avg_pts,
              ast: row.avg_ast,
              reb: row.avg_reb,
              stl: row.avg_stl,
            },
          ),
      }),
    );

    return gamesAboveStandardDeviation;
  }

  private getSDThresholds(
    averageOrBelowAveragePlayers: PlayerStats[],
    playerStandardDeviation: StandDeviationResult[],
  ) {
    // Get the player ids of the players who are below average or average
    const eligiblePlayers = averageOrBelowAveragePlayers
      .map((player) => {
        const sd = playerStandardDeviation.find(
          (r) => r.player_id === player.playerId,
        );
        return sd ? { player, sd } : null;
      })
      .filter(
        (entry): entry is { player: PlayerStats; sd: StandDeviationResult } =>
          entry !== null,
      );

    const playerIds = eligiblePlayers.map(({ player }) => player.playerId);

    const ptsThresholds = eligiblePlayers.map(
      ({ player, sd }) =>
        player.pts.toNumber() + sd.standard_deviation_points.toNumber() * 2.0,
    );

    const astThresholds = eligiblePlayers.map(
      ({ player, sd }) =>
        player.ast.toNumber() + sd.standard_deviation_assists.toNumber() * 2.0,
    );

    const rebThresholds = eligiblePlayers.map(
      ({ player, sd }) =>
        player.reb.toNumber() + sd.standard_deviation_rebounds.toNumber() * 2.0,
    );

    const stlsThresholds = eligiblePlayers.map(
      ({ player, sd }) =>
        player.stl.toNumber() + sd.standard_deviation_steals.toNumber() * 2.0,
    );

    // Create standard deviation thresholds to show standard deviations of players
    // via the player_game_logs table for points, assists, and rebounds, steals
    return {
      playerIds,
      ptsThresholds,
      astThresholds,
      rebThresholds,
      stlsThresholds,
    };
  }

  private getSDGamesByMatchCategoryGames(
    gamesAboveStandardDeviation: PlayerSDGameStatsQueryResult[],
  ) {
    // For each player, find the games where they performed above their standard deviation for points, assists, and rebounds + averageOrBelowAveragePlayers points, assists, and rebounds
    const gamesByMatchCategory: Record<string, PlayerSDGameStatsQueryResult[]> =
      {
        points: [],
        assists: [],
        rebounds: [],
        steals: [],
      };

    for (const game of gamesAboveStandardDeviation) {
      if (game.pts_match) {
        gamesByMatchCategory.points.push(game);
      }
      if (game.ast_match) {
        gamesByMatchCategory.assists.push(game);
      }
      if (game.reb_match) {
        gamesByMatchCategory.rebounds.push(game);
      }
      if (game.stl_match) {
        gamesByMatchCategory.steals.push(game);
      }
    }

    return gamesByMatchCategory;
  }

  private getSDGameAveragesByPlayer(
    avgMin: Decimal,
    avgPoints: Decimal,
    averageSteals: Decimal,
    averageAssists: Decimal,
    averageRebounds: Decimal,
  ) {
    return {
      avgMin: Number(avgMin.toFixed(1)),
      avgPts: Number(avgPoints.toFixed(1)),
      avgStl: Number(averageSteals.toFixed(1)),
      avgAst: Number(averageAssists.toFixed(1)),
      avgReb: Number(averageRebounds.toFixed(1)),
    };
  }

  private getDifferenceBetweenPlayerStatsAndAverageSDStats(
    playerStats: PlayerStats,
    averageStats: {
      min: Decimal;
      pts: Decimal;
      ast: Decimal;
      reb: Decimal;
      stl: Decimal;
    },
  ) {
    return {
      minDiff: Number(
        (Number(averageStats.min) - Number(playerStats.min)).toFixed(1),
      ),
      ptsDiff: Number(
        (Number(averageStats.pts) - Number(playerStats.pts)).toFixed(1),
      ),
      astDiff: Number(
        (Number(averageStats.ast) - Number(playerStats.ast)).toFixed(1),
      ),
      rebDiff: Number(
        (Number(averageStats.reb) - Number(playerStats.reb)).toFixed(1),
      ),
      stlDiff: Number(
        (Number(averageStats.stl) - Number(playerStats.stl)).toFixed(1),
      ),
    };
  }

  async findUndervaluedPlayers({
    season,
    seasonType,
    positions,
  }: FindUndervaluedPlayersQueryDto) {
    // Create a map of pending promises for Promise.all to get the league averages for each position
    const leagueAveragesPromises = positions.map((position) =>
      this.getLeagueAllAveragesByPosition(season, seasonType, position),
    );
    const leagueAveragesResults = await Promise.all(leagueAveragesPromises);

    // Create a map of pending promises for Promise.all to get the average stats for each position
    const averageStatsPromises = positions.map((position) =>
      this.getSeasonAverageStats(season, seasonType, position),
    );

    // Wait for all the promises to resolve and store the results in a map
    const averageStatsResults = await Promise.all(averageStatsPromises);

    // Create a map of all postions whose stats are at or below average from our averageStatsResults to be awaited for a promise
    const averageOrBelowAveragePlayersPromises = positions.map(
      (position, index) => {
        const averageStats = averageStatsResults[index];

        if (!averageStats) {
          throw new Error(
            `No average stats found for position ${position} in season ${season} and season type ${seasonType}`,
          );
        }

        return this.getAverageOrBelowAveragePlayers(
          season,
          seasonType,
          averageStats,
          position,
        );
      },
    );

    // Wait for all the promises to resolve and store the results in a map
    const averageOrBelowAveragePlayersResults = await Promise.all(
      averageOrBelowAveragePlayersPromises,
    );

    // flatten the array of arrays of players into a single array of players
    const averageOrBelowAveragePlayers =
      averageOrBelowAveragePlayersResults.flat();

    // Get the player ids of the players who are below average or average
    const playerIds = averageOrBelowAveragePlayers.map(
      (player) => player.playerId,
    );

    // Calculate the standard deviation of the stats for the players who are below average or average
    const calculateStandarDeviationOfPlayers =
      await this.calculateStandardDeviationOfPlayerStats(
        season,
        seasonType,
        playerIds,
      );

    // For each player,
    // find the games where they
    // performed above their standard deviation for
    // points, assists, or rebounds
    // + averageOrBelowAveragePlayers points, assists, or rebounds
    // by 2 standard deviations
    const playesWithGamesAboveSD =
      await this.getPlayersWithAboveStandardDeviation(
        season,
        seasonType,
        averageOrBelowAveragePlayers,
        calculateStandarDeviationOfPlayers,
      );

    // Sort the gamesAboveStandardDeviation array
    // by the count of games above standard deviation in ascending order
    playesWithGamesAboveSD.sort((a, b) => b.count - a.count);

    return {
      players: playesWithGamesAboveSD,
      playerCount: playesWithGamesAboveSD.length,
      leagueAverages: leagueAveragesResults,
    };
  }

  async getAvailableSeasons() {
    return await this.prisma.playerStats.findMany({
      distinct: ['season'],
      select: { season: true },
      orderBy: { season: 'desc' },
    });
  }

  async getAvailableSeasonTypes() {
    return await this.prisma.playerStats.findMany({
      distinct: ['seasonType'],
      select: { seasonType: true },
    });
  }

  async getAvailablePositionTypes() {
    return await this.prisma.playerInfo.findMany({
      distinct: ['position'],
      select: { position: true },
    });
  }
}
