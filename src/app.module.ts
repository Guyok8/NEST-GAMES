import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from './games/games.module';
import { Game } from './games/game.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Game],
      synchronize: true, // DEV ONLY (learning). In real production use migrations.
    }),
    GamesModule,
  ],
})
export class AppModule {}
