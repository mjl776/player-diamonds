import { Controller, Get, Query } from "@nestjs/common";
import { PlayerStatsService } from "./playerstats.service";
import { FindUndervaluedPlayersQueryDto } from "./playerstats.models";

@Controller()
export class PlayerStatsController {
    constructor(private readonly playerStatsService: PlayerStatsService) {}

    @Get('find-undervalued-players')
    findUndervaluedPlayers(@Query() query: FindUndervaluedPlayersQueryDto) {
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

    @Get('available-positions')
    getAvailablePositions() {
        return this.playerStatsService.getAvailablePositionTypes();
    }

}