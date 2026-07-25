import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerStatsModule } from './PlayerStats/playerstats.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PlayerStatsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
