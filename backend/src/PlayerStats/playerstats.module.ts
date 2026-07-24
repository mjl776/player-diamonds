import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { PlayerStatsController } from './playerstats.controller';
import { PlayerStatsService } from './playerstats.service';

@Module({
  imports: [PrismaModule],
  controllers: [PlayerStatsController],
  providers: [PlayerStatsService],
})
export class PlayerStatsModule {}
