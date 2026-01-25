import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateGameDto } from './dto/update-game.dto'; // ensure you have this import
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { CreateGameDto } from './dto/create-game.dto';


@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gamesRepo: Repository<Game>,
  ) {}

  // get all games
  async findAll() {
    return this.gamesRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  // get a game by id
  async findOne(id: string) {
    const game = await this.gamesRepo.findOne({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  // create a new game
  async create(dto: CreateGameDto) {
    const game = this.gamesRepo.create(dto);
    return this.gamesRepo.save(game);
  }

  // DELETE - delete a game by id
  async remove(id: string) {
    const result = await this.gamesRepo.delete({ id });
  
    // delete() returns how many rows were deleted
    if (!result.affected || result.affected === 0) {
      throw new NotFoundException('Game not found');
    }
  
    return { message: 'Game removed successfully' };
  }
  // PATCH -update some fields of a game by id
  async update(id: string, dto: UpdateGameDto) {
    // 1) Reject empty body (PATCH with {} should not silently succeed)
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields provided for update');
    }
  
    // 2) preload = "find by id, then merge dto into entity"
    // If id doesn't exist, preload returns null
    const game = await this.gamesRepo.preload({
      id,
      ...dto,
    });
  
    if (!game) {
      throw new NotFoundException('Game not found');
    }
  
    
    return this.gamesRepo.save(game);
  }  

  // PUT - replace all game information by id
  async replace(id: string, dto: CreateGameDto) {
    // Find the existing game first
    const existing = await this.gamesRepo.findOne({ where: { id } });
  
    if (!existing) {
      throw new NotFoundException('Game not found');
    }
  
    // PUT - Replace fields (full replace)
    existing.title = dto.title;
    existing.genre = dto.genre;
    existing.price = dto.price;
  
    // save updates because the entity already has an id
    return this.gamesRepo.save(existing);
  }
}
