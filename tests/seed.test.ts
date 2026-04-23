import { db } from '../db/client';
import { seedIfEmpty } from '../db/seed';

jest.mock('../db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

const mockDb = db as unknown as { select: jest.Mock; insert: jest.Mock };

describe('seedIfEmpty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('inserts data into all tables when database is empty', async () => {
    const mockValues = jest.fn().mockResolvedValue(undefined);
    const mockFrom = jest.fn().mockResolvedValue([]);
    mockDb.select.mockReturnValue({ from: mockFrom });
    mockDb.insert.mockReturnValue({ values: mockValues });

    await seedIfEmpty();

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ email: 'demo@test.com' }),
      ])
    );
  });

  it('does not insert data when database already has records', async () => {
    const mockFrom = jest.fn().mockResolvedValue([
      { id: 1, email: 'demo@test.com', password: 'password123', created_at: '2024-01-01' },
    ]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seedIfEmpty();

    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});