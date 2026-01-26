import { NotFoundException } from '@nestjs/common';
import { GamesService } from './games.service';

// ✅ Import TypeORM types for mocking the repository
import { Repository, DeleteResult } from 'typeorm';

// ✅ Import your entity (the repository is Repository<Game>)
import { Game } from './game.entity';

describe('GamesService', () => {
  let service: GamesService;

  // ✅ This replaces your old dbMock.query
  // We'll mock only the repo methods your service uses.
  let repoMock: Partial<Repository<Game>>;

  beforeEach(() => {
    // ✅ create fresh mocks for every test (no history leaks between tests)
    repoMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      preload: jest.fn(),
    };

    // ✅ create a real service instance, but inject the mocked repo
    // (Your GamesService constructor should be: constructor(private readonly gamesRepo: Repository<Game>) {}
    service = new GamesService(repoMock as Repository<Game>);
  });

  // -----------------------------
  // findOne
  // -----------------------------

  it('findOne: should return a game when it exists', async () => {
    const fakeGame: Game = {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Hades',
      genre: 'Roguelike',
      price: 1999,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // ✅ repo returns an entity when found
    (repoMock.findOne as jest.Mock).mockResolvedValue(fakeGame);

    const result = await service.findOne(fakeGame.id);

    expect(repoMock.findOne).toHaveBeenCalledTimes(1);
    // depending on your service, it might call findOne({ where: { id } })
    // we won't be strict about exact args unless you want it
    expect(result).toEqual(fakeGame);
  });

  it('findOne: should throw NotFoundException when game does not exist', async () => {
    // ✅ repo returns null when not found
    (repoMock.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.findOne('some-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  // -----------------------------
  // remove
  // -----------------------------

  it('remove: should return success message when delete actually removed a row', async () => {
    // ✅ TypeORM delete returns { affected: number }
    const deleteResult: DeleteResult = { affected: 1, raw: [] } as any;

    (repoMock.delete as jest.Mock).mockResolvedValue(deleteResult);

    const result = await service.remove('some-id');

    expect(repoMock.delete).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ message: 'Game removed successfully' });
  });

  it('remove: should throw NotFoundException when no row was deleted', async () => {
    const deleteResult: DeleteResult = { affected: 0, raw: [] } as any;

    (repoMock.delete as jest.Mock).mockResolvedValue(deleteResult);

    await expect(service.remove('some-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
