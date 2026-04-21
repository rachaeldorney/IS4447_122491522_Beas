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
  { user_id: 1, name: 'Health', colour: '#82C91E', icon: 'heart' },
  { user_id: 1, name: 'Home', colour: '#F59F00', icon: 'home' },
]);

await db.insert(habits).values([
  { user_id: 1, category_id: 1, name: 'Workout', description: '30 min session', created_at: '2026-01-01' },
  { user_id: 1, category_id: 1, name: 'Morning Walk', description: '20 min walk', created_at: '2026-01-04' },
  { user_id: 1, category_id: 2, name: 'Meditate', description: '10 min session', created_at: '2026-01-10' },
  { user_id: 1, category_id: 2, name: 'Journal', description: 'Daily reflection', created_at: '2026-01-23' },
  { user_id: 1, category_id: 3, name: 'Read', description: 'Read for 20 mins', created_at: '2026-01-30' },
  { user_id: 1, category_id: 3, name: 'Study', description: 'Study for 1 hour', created_at: '2026-02-01' },
  { user_id: 1, category_id: 4, name: 'Eat Breakfast', description: 'Eat breakfast within 1 hour of waking up', created_at: '2026-02-11' },
  { user_id: 1, category_id: 4, name: 'Take Vitamins', description: 'Daily vitamins', created_at: '2026-02-21' },
  { user_id: 1, category_id: 4, name: 'Drink Water', description: '2 litres a day', created_at: '2026-03-03' },
  { user_id: 1, category_id: 5, name: 'Make Bed', description: 'Every morning', created_at: '2026-03-09' },
  { user_id: 1, category_id: 5, name: 'Clean', description: 'Tidy up daily', created_at: '2026-03-18' },
  { user_id: 1, category_id: 4, name: 'Brush Teeth', description: 'Morning and night', created_at: '2026-04-15' },
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
  { habit_id: 3, date: '2024-01-01', count: 1 },
  { habit_id: 3, date: '2024-01-02', count: 1 },
  { habit_id: 3, date: '2024-01-03', count: 1 },
  { habit_id: 4, date: '2024-01-01', count: 1 },
  { habit_id: 4, date: '2024-01-02', count: 1 },
  { habit_id: 5, date: '2024-01-01', count: 1 },
  { habit_id: 5, date: '2024-01-02', count: 1 },
  { habit_id: 5, date: '2024-01-03', count: 1 },
  { habit_id: 6, date: '2024-01-01', count: 1 },
  { habit_id: 6, date: '2024-01-02', count: 1 },
  { habit_id: 7, date: '2024-01-01', count: 1 },
  { habit_id: 7, date: '2024-01-02', count: 1 },
  { habit_id: 8, date: '2024-01-01', count: 1 },
  { habit_id: 9, date: '2024-01-01', count: 1 },
  { habit_id: 9, date: '2024-01-02', count: 1 },
  { habit_id: 10, date: '2024-01-01', count: 1 },
  { habit_id: 10, date: '2024-01-02', count: 1 },
  { habit_id: 11, date: '2024-01-01', count: 1 },
  { habit_id: 12, date: '2024-01-01', count: 1 },
  { habit_id: 12, date: '2024-01-02', count: 1 },
]);

  await db.insert(targets).values([
    { user_id: 1, habit_id: 1, period: 'weekly', goal: 5 },
    { user_id: 1, habit_id: 2, period: 'weekly', goal: 7 },
    { user_id: 1, category_id: 3, period: 'weekly', goal: 7 },
  ]);
}