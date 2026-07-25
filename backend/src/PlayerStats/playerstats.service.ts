import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma.service';
import { PlayerLeagueAverages } from '../../generated/prisma/client';
import { FindUnderValuedPlayersQuery } from './playerstats.models';

@Injectable()
export class PlayerStatsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getSeasonAverageStats(season: string, seasonType: string, position: string) {
    return await this.prisma.playerLeagueAverages.findFirst({
        where: { season: season, seasonType: seasonType, position: position},
    });
  }

  private async getAverageOrBelowAveragePlayers(season: string, seasonType: string, averagePlayerStats: PlayerLeagueAverages, position: string) {
    return await this.prisma.playerStats.findMany({
        where: {
            playerInfo: {
              position: position,
            },
            season: season,
            seasonType: seasonType,
            gp: { gte: 20 }, // Only consider players who have played at least 20 games
            min: { lte: averagePlayerStats.min },
            fgm: { lte: averagePlayerStats.fgm },
            fga: { lte: averagePlayerStats.fga },
            fgPct: { lte: averagePlayerStats.fgPct },
            fg3m: { lte: averagePlayerStats.fg3m },
            fg3a: { lte: averagePlayerStats.fg3a },
            fg3Pct: { lte: averagePlayerStats.fg3Pct },
            ftm: { lte: averagePlayerStats.ftm },
            fta: { lte: averagePlayerStats.fta },
            ftPct: { lte: averagePlayerStats.ftPct },
            oreb: { lte: averagePlayerStats.oreb },
            dreb: { lte: averagePlayerStats.dreb },
            reb: { lte: averagePlayerStats.reb },
            ast: { lte: averagePlayerStats.ast },
            tov: { lte: averagePlayerStats.tov },
            stl: { lte: averagePlayerStats.stl },
            blk: { lte: averagePlayerStats.blk },
            blka: { lte: averagePlayerStats.blka },
            pf: { lte: averagePlayerStats.pf },
            pfd: { lte: averagePlayerStats.pfd },
            pts: { lte: averagePlayerStats.pts },
            plusMinus: { lte: averagePlayerStats.plusMinus },
        },
    });
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

    return averageOrBelowAveragePlayers;
  }

}