import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function getLeaguePlayerStatAverages(season: string, seasonType: string) {

        const leagueAverages = await prisma.playerStats.aggregate({
          where: {
            season,
            seasonType,
          },
          _avg: {
            min: true,
            fgm: true,
            fga: true,
            fgPct: true,
            fg3m: true,
            fg3a: true,
            fg3Pct: true,
            ftm: true,
            fta: true,
            ftPct: true,
            oreb: true,
            dreb: true,
            reb: true,
            ast: true,
            tov: true,
            stl: true,
            blk: true,
            blka: true,
            pf: true,
            pfd: true,
            pts: true,
            plusMinus: true,
          },
        });

        const savedResult = await prisma.playerLeagueAverages.create({
          data: {
            season,
            seasonType,
            min: leagueAverages._avg.min!,
            fgm: leagueAverages._avg.fgm!,
            fga: leagueAverages._avg.fga!,
            fgPct: leagueAverages._avg.fgPct!,
            fg3m: leagueAverages._avg.fg3m!,
            fg3a: leagueAverages._avg.fg3a!,
            fg3Pct: leagueAverages._avg.fg3Pct!,
            ftm: leagueAverages._avg.ftm!,
            fta: leagueAverages._avg.fta!,
            ftPct: leagueAverages._avg.ftPct!,
            oreb: leagueAverages._avg.oreb!,
            dreb: leagueAverages._avg.dreb!,
            reb: leagueAverages._avg.reb!,
            ast: leagueAverages._avg.ast!,
            tov: leagueAverages._avg.tov!,
            stl: leagueAverages._avg.stl!,
            blk: leagueAverages._avg.blk!,
            blka: leagueAverages._avg.blka!,
            pf: leagueAverages._avg.pf!,
            pfd: leagueAverages._avg.pfd!,
            pts: leagueAverages._avg.pts!,
            plusMinus: leagueAverages._avg.plusMinus!,
          },
        });

        return savedResult;
}

const [season, seasonType] = process.argv.slice(2);

if (!season || !seasonType) {
  console.error("Usage: ts-node getLeaguePlayerStatAverages.ts <season> <seasonType>");
  process.exit(1);
}

getLeaguePlayerStatAverages(season, seasonType)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());