// games.controller.ts
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';


@Controller('games') // routes to this controller
export class GamesController {
  constructor(private readonly gamesService: GamesService) {} // injects GamesService

  // get all games
  @Get() 
  findAll() { // calls the service to get all games
    return this.gamesService.findAll(); // returns the games
  }

  // GET a game by id
  @Get(':id')
  async findOne(@Param('id') id: string) { // calls the service to get a game by id
    return this.gamesService.findOne(id); // returns the game
  }

// // delete a game by id
  @Delete(':id') 
  async remove(@Param('id') id: string) { // calls the service to delete a game by id
    await this.gamesService.remove(id); // returns the deleted game
  
    return {
      message: 'Game removed successfully', // returns the message
    };
  }
// // create a new game boundary test temporarily
@Post()
async create(@Body() dto: CreateGameDto) {
  return this.gamesService.create(dto);
}

  // Update parts of a game by id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateGameDto) { // calls the service to update a game by id
    return this.gamesService.update(id, dto); // returns the updated game
  }

  // PUT - replace all game information by id
  @Put(':id')
  async replace(@Param('id') id: string, @Body() dto: CreateGameDto) {
    return this.gamesService.replace(id, dto);
  }
}
