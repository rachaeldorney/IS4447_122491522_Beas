import { db } from '@/db/client';
import { categories as categoriesTable, habits as habitsTable, targets as targetsTable } from '@/db/schema';
import { seedIfEmpty } from '@/db/seed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from "expo-notifications";
import { Stack, useRouter, useSegments } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

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
  currentUser: { id: number; email: string } | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<{ id: number; email: string } | null>>;
};

export const AppContext = createContext<AppContextType | null>(null);

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [targets, setTargets] = useState<Target[]>([]); 
  const [currentUser, setCurrentUser] = useState<{ id: number; email: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      Appearance.setColorScheme(saved);
    }
  };
  void loadTheme();
}, []);

  useEffect(() => {
  const loadData = async () => {
    await seedIfEmpty();
    const habitRows = await db.select().from(habitsTable);
    const categoryRows = await db.select().from(categoriesTable);
    const targetRows = await db.select().from(targetsTable);
    setHabits(habitRows);
    setCategories(categoryRows);
    setTargets(targetRows);
    setAuthChecked(true);
  };
  void loadData();
}, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authChecked) return;
    const inAuthScreen = segments[0]?.toString() === 'login' || segments[0]?.toString() === 'register';
    if (!currentUser && !inAuthScreen) {
      router.replace('/login' as any);
    }
  }, [authChecked, currentUser, segments]);

  useEffect(() => {
  const configureNotificationsAsync = async () => {
    const { granted } = await Notifications.requestPermissionsAsync();
    if (!granted) {
      return console.warn("Notification permissions not granted");
    }

    // Configure how notifications appear when app is in foreground
    // https://dev.to/walter_bloggins/local-notifications-in-expo-2p47
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldShowAlert: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Cancel existing notifications before rescheduling
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Daily reminder at 6pm to log habits
    // expo-notifications — https://dev.to/walter_bloggins/local-notifications-in-expo-2p47
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Béas',
        body: "Don't forget to log your habits today!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 18,
        minute: 0,
      },
    });

    // Weekly check-in every Sunday at 10am
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Béas Weekly Check-in',
        body: 'How are your targets looking this week?',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 1,
        hour: 10,
        minute: 0,
      },
    });
  };
  void configureNotificationsAsync();
}, []);

  return (
  <AppContext.Provider value={{ habits, setHabits, categories, setCategories, targets, setTargets, currentUser, setCurrentUser }}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="menu" options={{ presentation: 'modal' }} />
      <Stack.Screen name="add" options={{ headerShown: false }} />
      <Stack.Screen name="habit/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="habit/[id]/edit" options={{ headerShown: false }} />
      <Stack.Screen name="category" options={{ headerShown: false }} />
      <Stack.Screen name="target" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
  </AppContext.Provider>
);
}