import { db } from '@/db/client';
import { categories as categoriesTable, habits as habitsTable } from '@/db/schema';
import { seedIfEmpty } from '@/db/seed';
import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';

// Habit type — matches the habits table
export type Habit = {
  id: number;
  user_id: number;
  category_id: number;
  name: string;
  description: string | null;
  created_at: string;
};

// Category type — matches the categories table
export type Category = {
  id: number;
  user_id: number;
  name: string;
  colour: string;
  icon: string | null;
};

// What gets shared across all screens
type AppContextType = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const AppContext = createContext<AppContextType | null>(null);

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await seedIfEmpty(); // populate sample data on first launch
      const habitRows = await db.select().from(habitsTable);
      const categoryRows = await db.select().from(categoriesTable);
      setHabits(habitRows);
      setCategories(categoryRows);
    };
    void loadData();
  }, []);

  return (
    <AppContext.Provider value={{ habits, setHabits, categories, setCategories }}>
      <Stack />
    </AppContext.Provider>
  );
}