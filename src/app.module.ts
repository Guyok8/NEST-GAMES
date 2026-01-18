import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, GamesModule],
})
export class AppModule {}
