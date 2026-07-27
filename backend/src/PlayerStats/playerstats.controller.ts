import { Controller, Get, Query } from "@nestjs/common";
import { PlayerStatsService } from "./playerstats.service";
import { SeasonAndSeasonTypeQuery } from "./playerstats.models";

@Controller()
export class PlayerStatsController {
    constructor(private readonly playerStatsService: PlayerStatsService) {}

    @Get('find-undervalued-players')
    findUndervaluedPlayers(@Query() query: SeasonAndSeasonTypeQuery) {
        return this.playerStatsService.findUndervaluedPlayers(query);
    }

    @Get('available-seasons')
    getAvailableSeasons() {
        return this.playerStatsService.getAvailableSeasons();
    }

    @Get('available-season-types')
    getAvailableSeasonTypes() {
        return this.playerStatsService.getAvailableSeasonTypes();
    }

}