 import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  created_at: text('created_at').notNull(),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').notNull(),
  name: text('name').notNull(),
  colour: text('colour').notNull(),
  icon: text('icon'),
});

export const habits = sqliteTable('habits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').notNull(),
  category_id: integer('category_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  duration: integer('duration'), // duration in minutes, optional
  notes: text('notes'), // optional free text notes
  created_at: text('created_at').notNull(),
});

export const habitLogs = sqliteTable('habit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  habit_id: integer('habit_id').notNull(),
  date: text('date').notNull(),
  count: integer('count').notNull().default(1),
  notes: text('notes'),
});

export const targets = sqliteTable('targets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').notNull(),
  habit_id: integer('habit_id'),
  category_id: integer('category_id'),
  period: text('period').notNull(), // 'weekly' or 'monthly'
  goal: integer('goal').notNull(),
});