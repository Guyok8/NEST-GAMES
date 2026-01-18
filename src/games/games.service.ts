import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

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
}


