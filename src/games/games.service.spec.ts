import { NotFoundException } from '@nestjs/common';
import { GamesService } from './games.service';

// This is a "mock" DatabaseService: same shape (query function), but not real DB
const dbMock = {
  query: jest.fn(),
};

describe('GamesService', () => {
  let service: GamesService;

  beforeEach(() => {
    // reset mock call history + behaviors before every test
    dbMock.query.mockReset();

    // create a real GamesService instance, but inject the mocked DB
    service = new GamesService(dbMock as any);
  });

  // Test to check if a game exists
  it('findOne: should return a game when it exists', async () => {
    const fakeGame = {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Hades',
      genre: 'Roguelike',
      price: 1999,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Tell the mock: when query() is called, return an object that looks like pg result
    dbMock.query.mockResolvedValue({ rows: [fakeGame] });

    const result = await service.findOne(fakeGame.id);

    expect(dbMock.query).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeGame);
  });

  // Test to check if a game does not exist
  it('findOne: should throw NotFoundException when game does not exist', async () => {
    // DB returns zero rows => game not found
    dbMock.query.mockResolvedValue({ rows: [] });

    await expect(service.findOne('some-id')).rejects.toBeInstanceOf(NotFoundException);
  });

  // Test to check if a game is deleted
  it('remove: should return success message when delete actually removed a row', async () => {
    // In pg, DELETE typically returns a result with rowCount
    dbMock.query.mockResolvedValue({ rowCount: 1 });
  
    const result = await service.remove('some-id');
  
    expect(dbMock.query).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Game removed successfully' });
  });
  
  it('remove: should throw NotFoundException when no row was deleted', async () => {
    dbMock.query.mockResolvedValue({ rowCount: 0 });
  
    await expect(service.remove('some-id')).rejects.toBeInstanceOf(NotFoundException);
  });
  
});


