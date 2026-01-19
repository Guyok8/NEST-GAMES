import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(private readonly db: DatabaseService) {}

  // get all games
  async findAll() {
    const result = await this.db.query(
      'SELECT id, title, genre, price, created_at, updated_at FROM games ORDER BY created_at DESC',
    );
    return result.rows;
  }

  // delete a game by id
  async remove(id: string) {
    const result = await this.db.query(
      'DELETE FROM games WHERE id = $1 RETURNING id',
      [id],
    );
  
    if (result.rows.length === 0) {
      throw new NotFoundException('Game ID not found');
    }
  
    // If we got here, delete succeeded
    return;
  }

  // Ceate a new game
  async create(dto: CreateGameDto) {
    const result = await this.db.query(
      `
      INSERT INTO games (title, genre, price)
      VALUES ($1, $2, $3)
      RETURNING id, title, genre, price, created_at, updated_at
      `,
      [dto.title, dto.genre, dto.price],
    );
  
    return result.rows[0];
  }
  
  // Update parts of a game by id
  async update(id: string, dto: UpdateGameDto) {
    // 1) Collect fields that were actually provided
    const fields: { key: string; value: any }[] = [];
  
    if (dto.title !== undefined) fields.push({ key: 'title', value: dto.title });
    if (dto.genre !== undefined) fields.push({ key: 'genre', value: dto.genre });
    if (dto.price !== undefined) fields.push({ key: 'price', value: dto.price });
  
    // 2) If the body is empty {}, reject it (PATCH must change something)
    if (fields.length === 0) {
      throw new BadRequestException('At least one field must be provided');
    }
  
    // 3) Build "SET title = $1, genre = $2 ..." dynamically
    const setClause = fields
      .map((f, index) => `${f.key} = $${index + 1}`)
      .join(', ');
  
    // 4) Values array matches the placeholders above
    const values = fields.map((f) => f.value);
  
    // 5) Add id as the LAST parameter ($n)
    values.push(id);
    const idParamIndex = values.length; // this becomes the $ number for id
  
    // 6) Run the UPDATE and return the updated row
    const result = await this.db.query(
      `
      UPDATE games
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${idParamIndex}
      RETURNING id, title, genre, price, created_at, updated_at
      `,
      values,
    );
  
    // 7) If no row returned, id didn’t exist
    if (result.rows.length === 0) {
      throw new NotFoundException('Game not found');
    }
  
    return result.rows[0];
  }
  // PUT - replace a game information by id
  async replace(id: string, dto: CreateGameDto) {
    const result = await this.db.query(
      `
      UPDATE games
      SET title = $1,
          genre = $2,
          price = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, title, genre, price, created_at, updated_at
      `,
      [dto.title, dto.genre, dto.price, id],
    );
  
    if (result.rows.length === 0) {
      throw new NotFoundException('Game not found');
    }
  
    return result.rows[0];
  }  
}


