import { db } from './client';
import { categories, habitLogs, habits, targets, users } from './schema';

export async function seedIfEmpty() {
  const existing = await db.select().from(users);
  if (existing.length > 0) return;

  await db.insert(users).values([
    { email: 'demo@test.com', password: 'password123', created_at: '2024-01-01' },
  ]);

  await db.insert(categories).values([
    { user_id: 1, name: 'Fitness', colour: '#FF6B6B', icon: 'flame' },
    { user_id: 1, name: 'Mindfulness', colour: '#4ECDC4', icon: 'brain' },
    { user_id: 1, name: 'Learning', colour: '#45B7D1', icon: 'book-open' },
  ]);

  await db.insert(habits).values([
    { user_id: 1, category_id: 1, name: 'Morning Run', description: '30 min run', created_at: '2024-01-01' },
    { user_id: 1, category_id: 2, name: 'Meditation', description: '10 min session', created_at: '2024-01-01' },
    { user_id: 1, category_id: 3, name: 'Read', description: 'Read for 20 mins', created_at: '2024-01-01' },
  ]);

  await db.insert(habitLogs).values([
    { habit_id: 1, date: '2024-01-01', count: 1 },
    { habit_id: 1, date: '2024-01-02', count: 1 },
    { habit_id: 1, date: '2024-01-03', count: 1 },
    { habit_id: 2, date: '2024-01-01', count: 1 },
    { habit_id: 2, date: '2024-01-02', count: 1 },
    { habit_id: 3, date: '2024-01-01', count: 2 },
    { habit_id: 3, date: '2024-01-02', count: 1 },
    { habit_id: 3, date: '2024-01-03', count: 3 },
  ]);

  await db.insert(targets).values([
    { user_id: 1, habit_id: 1, period: 'weekly', goal: 5 },
    { user_id: 1, habit_id: 2, period: 'weekly', goal: 7 },
    { user_id: 1, category_id: 3, period: 'weekly', goal: 7 },
  ]);
}