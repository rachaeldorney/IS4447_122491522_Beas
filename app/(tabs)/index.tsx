import { db } from '@/db/client';
import { habitLogs as habitLogsTable } from '@/db/schema';
import { Feather } from '@expo/vector-icons';
import { and, eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getGreeting } from 'react-native-greeting';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext, Habit } from '../_layout';


export default function HomeScreen() {
  const router = useRouter();
  const context = useContext(AppContext);
  const [todayLogs, setTodayLogs] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);

  const today = new Date().toISOString().split('T')[0];

    // Gets time-based greeting using react-native-greeting package
    // https://github.com/johnylie/react-native-greeting
  const greeting = getGreeting('').replace(',', ''); // removes comma

  useEffect(() => {
    const loadTodayLogs = async () => {
      // Fetch all logs from the database and filter for entries matching today's date
      // https://orm.drizzle.team/docs/select
      const logs = await db.select().from(habitLogsTable);
      const todayCompleted = logs
      // Filter logs to only today's entries, then extract the habit_id from each
      // Array.filter() and Array.map() — React and React Native Chapter 2
        .filter((log) => log.date === today)
        .map((log) => log.habit_id);
      setTodayLogs(todayCompleted);

      // Current streak — counts consecutive days going back from today OR yesterday
// Allows for the case where today hasn't been logged yet
const uniqueDates = [...new Set(logs.map((l) => l.date))].sort().reverse();
let bestStreak = 0;
let currentStreak = 0;
const checkDate = new Date();

// If nothing logged today, start checking from yesterday
const todayStr = checkDate.toISOString().split('T')[0];
if (!uniqueDates.includes(todayStr)) {
  checkDate.setDate(checkDate.getDate() - 1);
}

for (const date of uniqueDates) {
  const check = checkDate.toISOString().split('T')[0];
  if (date === check) {
    currentStreak++;
    bestStreak = Math.max(bestStreak, currentStreak);
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    break;
  }
}
  setStreak(currentStreak);
};
    void loadTodayLogs();
  }, []);

  if (!context) return null;

  const { habits, categories } = context;

  // Daily progress — how many habits have been ticked off today
  const dailyProgress = habits.length > 0 ? todayLogs.length / habits.length : 0;

  const toggleHabit = async (habitId: number) => {
    if (todayLogs.includes(habitId)) {
      // Delete the log entry where both habit_id and date match today — uses Drizzle's and() to combine two eq() conditions
      // https://orm.drizzle.team/docs/operators#and
      await db.delete(habitLogsTable).where(and( eq(habitLogsTable.habit_id, habitId), eq(habitLogsTable.date, today) ));
      setTodayLogs((prev) => prev.filter((id) => id !== habitId));
    } else {
      // Not logged yet — add a log for today
      await db.insert(habitLogsTable).values({
        habit_id: habitId,
        date: today,
        count: 1,
      });
      setTodayLogs((prev) => [...prev, habitId]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Header section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>
             {/* Returns todays date */}
           {/* https://www.geeksforgeeks.org/javascript/javascript-date-tolocaledatestring-method/ */}
            {new Date().toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
          <Text style={styles.greeting}>{greeting}</Text>
        </View>

        {/* Hamburger menu button */}
        <Pressable
          accessibilityLabel="Open menu"
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/menu' })}
          style={styles.menuButton}
        >
          <Feather name="menu" size={22} color="#831843" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Streak card */}
        <View style={styles.streakCard}>
          <View>
            <Text style={styles.streakNumber}>{streak}</Text>
            <Text style={styles.streakLabel}>day streak </Text>
          </View>
          <Text style={styles.streakMotivation}>
            {streak === 0 ? 'Start your streak today!' : streak < 7 ? 'Keep it up!' : 'You\'re on fire!'}
          </Text>
        </View>

        {/* Daily progress */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>today's progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.round(dailyProgress * 100)}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{todayLogs.length} of {habits.length} habits completed today</Text>
        </View>

        {/* Today's habits */}
        <Text style={styles.sectionTitle}>today</Text>
        {habits.map((habit: Habit) => {
          const isDone = todayLogs.includes(habit.id);
          const category = categories.find((c) => c.id === habit.category_id);

          return (
            <Pressable
              key={habit.id}
              accessibilityLabel={`${habit.name}, ${isDone ? 'completed' : 'not completed'}`}
              accessibilityRole="button"
              onPress={() => toggleHabit(habit.id)}
              style={styles.habitRow}
            >
                {/* Applies the category colour to the dot - grey if no category is found */}
                {/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing */}
              <View style={[styles.dot, { backgroundColor: category?.colour ?? '#CBD5E1' }]} />
              {/* Applies strikethrough  when the habit has been completed */}
              <Text style={[styles.habitName, isDone && styles.habitDone]}>{habit.name}</Text>
              {/* Renders the checkbox, filled with a tick icon when the habit is done today */}
              <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
                {/* Only renders the check icon inside the checkbox when the habit is marked as done */}
               {/*  https://react.dev/learn/conditional-rendering */}
                {isDone && <Feather name="check" size={10} color="#FFFFFF" />}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Floating action button */}
      <Pressable
        accessibilityLabel="Add habit"
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/add' })}
        style={styles.fab}
      >
        <Feather name="plus" size={28} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fcf9fa',
    flex: 1,
  },
  header: {
    backgroundColor: '#F9A8D4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 20,
  },
  date: {
    color: '#9D174D',
    fontSize: 12,
  },
  greeting: {
    color: '#831843',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 5,
  },
  menuButton: {
    padding: 8,
    marginTop: 10,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 100,
  },
  streakCard: {
    backgroundColor: '#FCE7F3',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 20,
  },
  streakNumber: {
    color: '#831843',
    fontSize: 32,
    fontWeight: '600',
  },
  streakLabel: {
    color: '#9D174D',
    fontSize: 13,
    marginTop: 2,
  },
  streakMotivation: {
    color: '#9D174D',
    fontSize: 13,
  },
  progressSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#9D174D',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  progressBar: {
    backgroundColor: '#FCE7F3',
    borderRadius: 4,
    height: 6,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#EC4899',
    borderRadius: 4,
    height: '100%',
  },
  progressLabel: {
    color: '#9D174D',
    fontSize: 12,
    marginTop: 4,
  },
  habitRow: {
    alignItems: 'center',
    borderBottomColor: '#FCE7F3',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
  },
  dot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  habitName: {
    color: '#111827',
    flex: 1,
    fontSize: 15,
  },
  habitDone: {
    color: '#9D174D',
    textDecorationLine: 'line-through',
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#F9A8D4',
    borderRadius: 4,
    borderWidth: 1.5,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  checkboxDone: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  fab: {
    alignItems: 'center',
    backgroundColor: '#EC4899',
    borderRadius: 999,
    bottom: 24,
    elevation: 4,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 60,
  },
});





