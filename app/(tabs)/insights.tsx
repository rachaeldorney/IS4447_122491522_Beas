import PinkHeader from '@/components/ui/pink-header';
import { db } from '@/db/client';
import { habitLogs as habitLogsTable } from '@/db/schema';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../_layout';

export default function InsightsScreen() {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [logs, setLogs] = useState<{ date: string; habit_id: number }[]>([]);
  const [selectedBar, setSelectedBar] = useState<{ date: string; count: number } | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<{ name: string; count: number } | null>(null);


  useEffect(() => {
    const loadLogs = async () => {
      // Fetch all habit logs from the database
      // https://orm.drizzle.team/docs/select
      const allLogs = await db.select().from(habitLogsTable);
      setLogs(allLogs);
    };
    void loadLogs();
  }, []);

  if (!context) return null;

  const { habits, categories } = context;

  // Generate last 7 days as date strings
  // https://stackoverflow.com/questions/22850929/most-efficient-way-to-get-the-dates-for-the-past-7-days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  // Build bar chart data — count logs per day for last 7 days
  // Array.filter and Array.length — React and React Native 5th Ed. (2024), Chapter: "Lists"
  const barData = last7Days.map((date) => ({
    value: logs.filter((l) => l.date === date).length,
    label: new Date(date).toLocaleDateString('en-IE', { weekday: 'short' }),
    frontColor: selectedBar?.date === date ? '#831843' : '#EC4899',
    onPress: () => setSelectedBar(
      selectedBar?.date === date ? null : {
        date: new Date(date).toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long' }),
        count: logs.filter((l) => l.date === date).length,
      }
    ),
  }));

  // Build pie chart data — count logs per category
  const pieData = categories.map((cat) => {
    const habitIds = habits.filter((h) => h.category_id === cat.id).map((h) => h.id);
    const count = logs.filter((l) => habitIds.includes(l.habit_id)).length;
    return {
      value: count,
      color: cat.colour,
      text: cat.name,
      onPress: () => setSelectedSlice(
        selectedSlice?.name === cat.name ? null : { name: cat.name, count }
      ),
    };
  }).filter((d) => d.value > 0);

  // Summary stats
  const totalThisWeek = last7Days.reduce(
    (sum, date) => sum + logs.filter((l) => l.date === date).length, 0
  );

  // Completion rate — how many habits completed at least once this week vs total habits
  const habitsCompletedThisWeek = new Set(
    logs.filter((l) => last7Days.includes(l.date)).map((l) => l.habit_id)
  ).size;
  const completionRate = habits.length > 0
    ? Math.round((habitsCompletedThisWeek / habits.length) * 100)
    : 0;

  // Daily average completions this week
  const dailyAverage = (totalThisWeek / 7).toFixed(1);

  // Most active day this week
  const mostActiveDay = last7Days.reduce((best, date) => {
    const count = logs.filter((l) => l.date === date).length;
    const bestCount = logs.filter((l) => l.date === best).length;
    return count > bestCount ? date : best;
  }, last7Days[0]);

  // Most completed habit overall
  const habitCompletionCounts = habits.map((h) => ({
    name: h.name,
    count: logs.filter((l) => l.habit_id === h.id).length,
  }));
  const mostCompleted = habitCompletionCounts.reduce(
    (best, h) => h.count > best.count ? h : best,
    { name: 'None', count: 0 }
  );

  // Least completed habit — only habits with at least one log
  const leastCompleted = habitCompletionCounts
    .filter((h) => h.count > 0)
    .reduce(
      (least, h) => h.count < least.count ? h : least,
      habitCompletionCounts.filter((h) => h.count > 0)[0] ?? { name: 'None', count: 0 }
    );

  // Best streak — consecutive days with at least one log
  const uniqueDates = [...new Set(logs.map((l) => l.date))].sort().reverse();
  let bestStreak = 0;
  let currentStreak = 0;
  const checkDate = new Date();
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1A0A10' : '#FCF9FA' }]} edges={['bottom']}>
      <PinkHeader title="Insights" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Summary stat cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalThisWeek}</Text>
            <Text style={styles.statLabel}>completions{'\n'}this week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completionRate}%</Text>
            <Text style={styles.statLabel}>completion{'\n'}rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{dailyAverage}</Text>
            <Text style={styles.statLabel}>daily{'\n'}average</Text>
          </View>
        </View>

        {/* Bar chart — completions per day, tapping a bar shows details */}
        <Text style={styles.sectionTitle}>Last 7 Days</Text>
        {selectedBar && (
          <View style={styles.tooltipCard}>
            <Text style={styles.tooltipText}>
              {selectedBar.date} - {selectedBar.count} {selectedBar.count === 1 ? 'completion' : 'completions'}
            </Text>
          </View>
        )}
        <View style={styles.chartCard}>
          <BarChart
            data={barData}
            barWidth={28}
            spacing={16}
            roundedTop
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: '#9D174D', fontSize: 11 }}
            xAxisLabelTextStyle={{ color: '#9D174D', fontSize: 11 }}
            noOfSections={4}
            maxValue={Math.max(...barData.map((d) => d.value), 4)}
          />
        </View>

        {/* Pie chart — breakdown by category, tapping a slice shows details */}
        {pieData.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>By Category</Text>
            {selectedSlice && (
              <View style={styles.tooltipCard}>
                <Text style={styles.tooltipText}>
                  {selectedSlice.name} - {selectedSlice.count} {selectedSlice.count === 1 ? 'completion' : 'completions'}
                </Text>
              </View>
            )}
            <View style={styles.chartCard}>
              <PieChart
                data={pieData}
                donut
                radius={90}
                innerRadius={55}
                centerLabelComponent={() => (
                  <Text style={styles.pieCenter}>{logs.length}{'\n'}total</Text>
                )}
              />
              <View style={styles.legend}>
                {pieData.map((item) => (
                  <View key={item.text} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.text} ({item.value})</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        <View style={styles.highlightCard}>
        <View style={styles.highlightRow}>
            <Feather name="zap" size={16} color="#9D174D" />
            <Text style={styles.highlightLabel}>Current streak</Text>
        </View>
        <Text style={styles.highlightValue}>{bestStreak} {bestStreak === 1 ? 'day' : 'days'}</Text>
        </View>

        <View style={styles.highlightCard}>
        <View style={styles.highlightRow}>
            <Feather name="calendar" size={16} color="#9D174D" />
            <Text style={styles.highlightLabel}>Most active day this week</Text>
        </View>
        <Text style={styles.highlightValue}>
            {new Date(mostActiveDay).toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        </View>

        <View style={styles.highlightCard}>
        <View style={styles.highlightRow}>
            <Feather name="star" size={16} color="#9D174D" />
            <Text style={styles.highlightLabel}>Most completed habit</Text>
        </View>
        <Text style={styles.highlightValue}>{mostCompleted.name} ({mostCompleted.count} {mostCompleted.count === 1 ? 'time' : 'times'})</Text>
        </View>

        <View style={styles.highlightCard}>
        <View style={styles.highlightRow}>
            <Feather name="alert-circle" size={16} color="#9D174D" />
            <Text style={styles.highlightLabel}>Needs attention</Text>
        </View>
        <Text style={styles.highlightValue}>{leastCompleted.name} ({leastCompleted.count} {leastCompleted.count === 1 ? 'time' : 'times'})</Text>
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
  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FCE7F3',
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  statNumber: {
    color: '#831843',
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    color: '#9D174D',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#9D174D',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  tooltipCard: {
    backgroundColor: '#831843',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FCE7F3',
    borderRadius: 10,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  pieCenter: {
    color: '#831843',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  legend: {
    marginTop: 16,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  legendText: {
    color: '#9D174D',
    fontSize: 13,
  },
  highlightCard: {
    backgroundColor: '#FCE7F3',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  highlightLabel: {
    color: '#9D174D',
    fontSize: 12,
    marginBottom: 4,
  },
  highlightValue: {
    color: '#831843',
    fontSize: 16,
    fontWeight: '600',
  },
  highlightRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  marginBottom: 4,
},
});