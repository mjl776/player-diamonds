import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma.service';
import { PlayerLeagueAverages } from '../../generated/prisma/client';
import { FindUnderValuedPlayersQuery } from './playerstats.models';

@Injectable()
export class PlayerStatsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getSeasonAverageStats(season: string, seasonType: string) {
    return await this.prisma.playerLeagueAverages.findFirst({
        where: { season: season, seasonType: seasonType },
    });
  }

  private async getAverageOrBelowAveragePlayers(season: string, seasonType: string, averagePlayerStats: PlayerLeagueAverages) {
    return await this.prisma.playerStats.findMany({
        where: {
            season: season,
            seasonType: seasonType,
            gp: { lte: 30 }, // Only consider players who have played at least 30 games
            min: { lte: averagePlayerStats.min },
            fgm: { lte: averagePlayerStats.fgm },
            fga: { lte: averagePlayerStats.fga },
            fgPct: { lte: averagePlayerStats.fgPct },
            fg3m: { lte: averagePlayerStats.fg3m },
            fg3a: { lte: averagePlayerStats.fg3a },
            fg3Pct: { lte: averagePlayerStats.fg3Pct },
            ftm: { lte: averagePlayerStats.ftm },
            fta: { lte: averagePlayerStats.fta },
            ftPct: { gte: averagePlayerStats.ftPct },
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
    const averagePlayerStats = await this.getSeasonAverageStats(season, seasonType);

    if (!averagePlayerStats) {
        throw new Error(`No average stats found for season ${season} and season type ${seasonType}`);
    };

    // Find players whose stats are at or below average
    const averageOrBelowAveragePlayers = await this.getAverageOrBelowAveragePlayers(season, seasonType, averagePlayerStats);

    return averageOrBelowAveragePlayers;

  }

}