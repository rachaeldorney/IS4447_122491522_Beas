import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habitLogs as habitLogsTable, targets as targetsTable } from '@/db/schema';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext, Target } from '../_layout';

export default function TargetDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!id || !context) return;
    const target = context.targets.find((t: Target) => t.id === Number(id));
    if (!target?.habit_id) return;

    const loadProgress = async () => {
      const logs = await db.select().from(habitLogsTable).where(eq(habitLogsTable.habit_id, target.habit_id!));
      const today = new Date();

      // Filter logs based on the target period
      const filtered = logs.filter((log) => {
        const logDate = new Date(log.date);
        if (target.period === 'daily') {
          return log.date === today.toISOString().split('T')[0];
        } else if (target.period === 'weekly') {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          weekStart.setHours(0, 0, 0, 0);
          return logDate >= weekStart;
        } else {
          return logDate.getMonth() === today.getMonth() &&
            logDate.getFullYear() === today.getFullYear();
        }
      });
      setCompletedCount(filtered.length);
    };
    void loadProgress();
  }, [id, context]);

  if (!context) return null;

  const { targets, habits, setTargets } = context;
  const target = targets.find((t: Target) => t.id === Number(id));
  const habit = habits.find((h) => h.id === target?.habit_id);

  if (!target) return null;

  const period = target.period.charAt(0).toUpperCase() + target.period.slice(1);
  const isComplete = completedCount >= target.goal;
  const isExceeded = completedCount > target.goal;
  const progress = Math.min(completedCount / target.goal, 1);
  const remaining = Math.max(target.goal - completedCount, 0);

  const deleteTarget = async () => {
    await db.delete(targetsTable).where(eq(targetsTable.id, Number(id)));
    const rows = await db.select().from(targetsTable);
    setTargets(rows);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1A0A10' : '#FCF9FA' }]} edges={['bottom']}>
      <PinkHeader title="Target Details" showBack />
      <View style={styles.content}>
        <View>
          {/* Habit name */}
          <View style={styles.detailRow}>
            <Feather name="check-square" size={16} color="#9D174D" />
            <Text style={styles.detailText}>{habit?.name ?? 'Unknown habit'}</Text>
          </View>

          {/* Goal */}
          <View style={styles.detailRow}>
            <Feather name="target" size={16} color="#9D174D" />
            <Text style={styles.detailText}>
              {target.goal} {target.goal === 1 ? 'time' : 'times'} {period}
            </Text>
          </View>

          {/* Progress section */}
         <Text style={styles.sectionTitle}>
            Progress this {target.period === 'daily' ? 'day' : target.period === 'weekly' ? 'week' : 'month'}
        </Text>

          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { width: `${Math.round(progress * 100)}%` },
              isExceeded && styles.progressFillExceeded,
            ]} />
          </View>

          {/* Progress label */}
          <Text style={styles.progressLabel}>
            {completedCount} of {target.goal} {target.goal === 1 ? 'time' : 'times'} completed
          </Text>

          {/* Status badge */}
          {isExceeded ? (
            <View style={[styles.badge, styles.badgeExceeded]}>
              <Text style={styles.badgeTextExceeded}>Smashing it! You exceeded your target</Text>
            </View>
          ) : isComplete ? (
            <View style={[styles.badge, styles.badgeComplete]}>
              <Text style={styles.badgeTextComplete}>Well done you reached your target!</Text>
            </View>
          ) : (
            <Text style={styles.badgeTextUnmet}>
                Complete {remaining} more {remaining === 1 ? 'time' : 'times'} to reach your goal
            </Text>
          )}
        </View>

        <PrimaryButton label="Delete Target" variant="danger" onPress={deleteTarget} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FCF9FA',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  detailText: {
    color: '#9D174D',
    fontSize: 15,
  },
  sectionTitle: {
    color: '#9D174D',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  progressBar: {
    backgroundColor: '#FCE7F3',
    borderRadius: 4,
    height: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    backgroundColor: '#EC4899',
    borderRadius: 4,
    height: '100%',
  },
  progressFillExceeded: {
    backgroundColor: '#82C91E',
  },
  progressLabel: {
    color: '#9D174D',
    fontSize: 13,
    marginBottom: 12,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  badgeComplete: {
    backgroundColor: '#FCE7F3',
  },
  badgeExceeded: {
    backgroundColor: '#EBFBEE',
  },
  badgeUnmet: {
    backgroundColor: '#FCE7F3',
  },
  badgeTextComplete: {
    color: '#831843',
    fontSize: 13,
    fontWeight: '600',
  },
  badgeTextExceeded: {
    color: '#2B8A3E',
    fontSize: 13,
    fontWeight: '600',
  },
  badgeTextUnmet: {
    color: '#831843',
    fontSize: 13,
    fontWeight: '600',
  },
});