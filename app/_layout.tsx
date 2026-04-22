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
  duration: number | null;
  notes: string | null;
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

// Target type — matches the targets table
export type Target = {
  id: number;
  user_id: number;
  habit_id: number | null;
  category_id: number | null;
  period: string;
  goal: number;
};

// What gets shared across all screens
type AppContextType = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  targets: Target[];
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
};

export const AppContext = createContext<AppContextType | null>(null);

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [targets, setTargets] = useState<Target[]>([]); 

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
  <AppContext.Provider value={{ habits, setHabits, categories, setCategories, targets, setTargets }}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="menu" options={{ presentation: 'modal' }} />
      <Stack.Screen name="add" options={{ headerShown: false }} />
      <Stack.Screen name="habit/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="habit/[id]/edit" options={{ headerShown: false }} />
      <Stack.Screen name="category" options={{ headerShown: false }} />
      <Stack.Screen name="target" options={{ headerShown: false }} />
</Stack>
  </AppContext.Provider>
);
}