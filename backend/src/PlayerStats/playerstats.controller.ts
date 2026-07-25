import { Controller, Get, Query } from "@nestjs/common";
import { PlayerStatsService } from "./playerstats.service";
import { FindUnderValuedPlayersQuery } from "./playerstats.models";

@Controller()
export class PlayerStatsController {
    constructor(private readonly playerStatsService: PlayerStatsService) {}

    @Get('find-undervalued-players')
    findUndervaluedPlayers(@Query() query: FindUnderValuedPlayersQuery) {
        return this.playerStatsService.findUndervaluedPlayers(query);
    }
}