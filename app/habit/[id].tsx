import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habitLogs as habitLogsTable, habits as habitsTable } from '@/db/schema';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext, Habit } from '../_layout';

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [recentLogs, setRecentLogs] = useState<string[]>([]);

// Fetches habit logs from SQLite when the screen loads
  useEffect(() => {
    if (!id) return;
    const loadLogs = async () => {
      // https://orm.drizzle.team/docs/select
      const logs = await db.select().from(habitLogsTable).where(eq(habitLogsTable.habit_id, Number(id)));
      
      // Build an array of the last 7 date strings to filter logs against - adapted from — https://stackoverflow.com/questions/22850929/most-efficient-way-to-get-the-dates-for-the-past-7-days
      const today = new Date();
      const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        return d.toISOString().split('T')[0];
      });

      // Deduplicate dates using Set, then filter to only the last 7 days - https://javascript.info/map-set
      // Array.map and Array.filter chaining — React and React Native 5th Ed 2024 p.330
      const dates = [...new Set(logs.map((l) => l.date))].filter((date) => last7.includes(date));
      setRecentLogs(dates);
    };

    void loadLogs();
  }, [id]);

  if (!context) return null;

  const { habits, categories, setHabits } = context;
  const habit = habits.find((h: Habit) => h.id === Number(id));
  const category = categories.find((c) => c.id === habit?.category_id);

  if (!habit) return null;

  const formattedDate = new Date(habit.created_at).toLocaleDateString('en-IE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const deleteHabit = async () => {
    await db.delete(habitsTable).where(eq(habitsTable.id, Number(id)));
    const rows = await db.select().from(habitsTable);
    setHabits(rows);
    router.back();
  };
// https://stackoverflow.com/questions/22850929/most-efficient-way-to-get-the-dates-for-the-past-7-days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1A0A10' : '#FCF9FA' }]} edges={['bottom']}>
       <PinkHeader title="Habit Details" showBack rightIcon="edit-2" onRightPress={() => router.push({ pathname: '/habit/[id]/edit', params: { id } })}/>
  
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Habit name and category colour dot */}
          <View style={styles.nameRow}>
            <Text style={styles.habitName}>{habit.name}</Text>
          </View>

          {/* Category */}
          <View style={styles.detailRow}>
            <Feather name="folder" size={16} color="#9D174D" />
            <Text style={styles.detailText}>{category?.name ?? 'Uncategorised'}</Text>
          </View>

          {/* Date added */}
          <View style={styles.detailRow}>
            <Feather name="calendar" size={16} color="#9D174D" />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>

          {/* Duration if set */}
          {habit.duration ? (
            <View style={styles.detailRow}>
              <Feather name="clock" size={16} color="#9D174D" />
              <Text style={styles.detailText}>{habit.duration} mins</Text>
            </View>
          ) : null}

          {/* Notes if set */}
          {habit.notes ? (
            <View style={styles.detailRow}>
              <Feather name="file-text" size={16} color="#9D174D" />
              <Text style={styles.detailText}>{habit.notes}</Text>
            </View>
          ) : null}

        {/* Mini log history — shows last 7 days with filled dot if habit was logged that day */}
        <Text style={styles.sectionTitle}>Last 7 Days</Text>
        <View style={styles.logRow}>
          {last7Days.map((date) => {
            const done = recentLogs.includes(date);
            const dayLabel = new Date(date).toLocaleDateString('en-IE', { weekday: 'short' });
            return (
              <View key={date} style={styles.logDay}>
                <View style={[styles.logDot, done && styles.logDotDone]} />
                <Text style={styles.logDayLabel}>{dayLabel}</Text>
              </View>
            );
          })}
        </View>

        {/* Total completions */}
        <View style={styles.totalRow}>
          <Feather name="check-circle" size={16} color="#9D174D" />
          <Text style={styles.detailText}>Completed {recentLogs.length} times in last 7 days</Text>
        </View>

        <View style={styles.deleteButton}>
          <PrimaryButton label="Delete Habit" variant="danger" onPress={deleteHabit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FCF9FA',
    flex: 1,
  },
   editButton: {
    padding: 4,
    marginLeft: 'auto',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 40,
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  habitName: {
    color: '#831843',
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  detailText: {
    color: '#9D174D',
    fontSize: 15,
  },
  buttons: {
    gap: 10,
  },
  buttonSpacing: {
    marginTop: 4,
  },
  sectionTitle: {
    color: '#9D174D',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 24,
    textTransform: 'uppercase',
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logDay: {
    alignItems: 'center',
    gap: 6,
  },
  logDot: {
    backgroundColor: '#FCE7F3',
    borderRadius: 999,
    height: 32,
    width: 32,
  },
  logDotDone: {
    backgroundColor: '#EC4899',
  },
  logDayLabel: {
    color: '#9D174D',
    fontSize: 11,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  deleteButton: {
    marginTop: 8,
  },
});