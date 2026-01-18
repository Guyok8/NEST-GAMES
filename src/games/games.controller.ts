// games.controller.ts
import { Controller, Delete, Get, HttpCode, Param } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games') // routes to this controller
export class GamesController {
  constructor(private readonly gamesService: GamesService) {} // injects GamesService

  @Get() // get all games
  findAll() { // calls the service to get all games
    return this.gamesService.findAll(); // returns the games
  }

  @Delete(':id') // delete a game by id
  async remove(@Param('id') id: string) { // calls the service to delete a game by id
    await this.gamesService.remove(id); // returns the deleted game
  
    return {
      message: 'Game removed successfully', // returns the message
    };
  }
}
