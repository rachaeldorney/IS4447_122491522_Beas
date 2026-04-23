import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../_layout';

const periods = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

// Target type options — global, per category, or per habit
const targetTypes = [
  { label: 'Global', value: 'global' },
  { label: 'Category', value: 'category' },
  { label: 'Habit', value: 'habit' },
];

export default function AddTarget() {
  const router = useRouter();
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [goal, setGoal] = useState(1);
  const [period, setPeriod] = useState<string>('weekly');
  const [targetType, setTargetType] = useState('global');

  // Habit dropdown state react-native-dropdown-picker — https://github.com/hossein-zare/react-native-dropdown-picker
  const [habitOpen, setHabitOpen] = useState(false);
  const [habitValue, setHabitValue] = useState<number | null>(null);
  const [habitItems, setHabitItems] = useState<{ label: string; value: number }[]>([]);

  // Category dropdown state
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState<number | null>(null);
  const [categoryItems, setCategoryItems] = useState<{ label: string; value: number }[]>([]);

  if (!context) return null;
  const { habits, categories, setTargets } = context;

  // Build dropdown items from habits and categories in context
  // Array.map() — React and React Native Chapter 2
  const habitDropdownItems = habits.map((h) => ({
    label: h.name,
    value: h.id,
  }));

  const categoryDropdownItems = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const saveTarget = async () => {
    // Validate based on target type before saving
    if (targetType === 'habit' && !habitValue) return;
    if (targetType === 'category' && !categoryValue) return;

     // Conditionally set habit_id or category_id based on target type
    await db.insert(targetsTable).values({
      user_id: 1,
      habit_id: targetType === 'habit' ? habitValue : null,
      category_id: targetType === 'category' ? categoryValue : null,
      period,
      goal,
    });

    const rows = await db.select().from(targetsTable);
    setTargets(rows);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1A0A10' : '#FCF9FA' }]} edges={['bottom']}>
      <PinkHeader title="Add Target" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>

          {/* Target type selector — global, category or habit */}
          <Text style={styles.label}>Target Type</Text>
          <View style={styles.periodRow}>
            {targetTypes.map((t) => {
              const isSelected = targetType === t.value;
              return (
                <Pressable
                  key={t.value}
                  accessibilityLabel={`Select ${t.label}`}
                  accessibilityRole="button"
                  onPress={() => setTargetType(t.value)}
                  style={[styles.periodButton, isSelected && styles.periodButtonSelected]}
                >
                  <Text style={[styles.periodButtonText, isSelected && styles.periodButtonTextSelected]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* {/* Conditionally renders habit picker only when habit type is selected */}
          {targetType === 'habit' && (
            <>
              <Text style={styles.label}>Habit</Text>
              <DropDownPicker
                open={habitOpen}
                value={habitValue}
                items={habitDropdownItems}
                setOpen={setHabitOpen}
                setValue={setHabitValue}
                setItems={setHabitItems}
                placeholder="Select a habit"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                listMode="SCROLLVIEW"
                zIndex={3000}
                zIndexInverse={1000}
              />
            </>
          )}

          {/* Show category picker only when category type is selected */}
          {targetType === 'category' && (
            <>
              <Text style={styles.label}>Category</Text>
              <DropDownPicker
                open={categoryOpen}
                value={categoryValue}
                items={categoryDropdownItems}
                setOpen={setCategoryOpen}
                setValue={setCategoryValue}
                setItems={setCategoryItems}
                placeholder="Select a category"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                listMode="SCROLLVIEW"
                zIndex={2000}
                zIndexInverse={2000}
              />
            </>
          )}

          {/* Period picker */}
          <Text style={styles.label}>Period</Text>
          <View style={styles.periodRow}>
            {periods.map((p) => {
              const isSelected = period === p.value;
              return (
                <Pressable
                  key={p.value}
                  accessibilityLabel={`Select ${p.label}`}
                  accessibilityRole="button"
                  onPress={() => setPeriod(p.value)}
                  style={[styles.periodButton, isSelected && styles.periodButtonSelected]}
                >
                  <Text style={[styles.periodButtonText, isSelected && styles.periodButtonTextSelected]}>
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Goal picker */}
          <Text style={styles.label}>Goal</Text>
          <View style={styles.goalRow}>
            <Pressable
              accessibilityLabel="Decrease goal"
              accessibilityRole="button"
              onPress={() => setGoal(Math.max(1, goal - 1))}
              style={styles.goalButton}
            >
              <Text style={styles.goalButtonText}>−</Text>
            </Pressable>
            <Text style={styles.goalNumber}>{goal}</Text>
            <Pressable
              accessibilityLabel="Increase goal"
              accessibilityRole="button"
              onPress={() => setGoal(goal + 1)}
              style={styles.goalButton}
            >
              <Text style={styles.goalButtonText}>+</Text>
            </Pressable>
          </View>
          <Text style={styles.goalHint}>
            {targetType === 'global' ? 'Complete any habit' : targetType === 'category' ? 'Complete habits in this category' : 'Complete this habit'} {goal} {goal === 1 ? 'time' : 'times'} {period}
          </Text>
        </View>

        <PrimaryButton label="Save Target" onPress={saveTarget} />
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
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 40,
  },
  form: {
    gap: 24,
    marginBottom: 24,
  },
  label: {
    color: '#831843',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FCE7F3',
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: '#FCE7F3',
    borderRadius: 8,
  },
  periodRow: {
    flexDirection: 'row',
    gap: 10,
  },
  periodButton: {
    borderColor: '#FCE7F3',
    borderRadius: 8,
    borderWidth: 1.5,
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  periodButtonSelected: {
    backgroundColor: '#831843',
    borderColor: '#831843',
  },
  periodButtonText: {
    color: '#831843',
    fontSize: 14,
    fontWeight: '500',
  },
  periodButtonTextSelected: {
    color: '#FFFFFF',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  goalButton: {
    backgroundColor: '#FCE7F3',
    borderRadius: 8,
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalButtonText: {
    color: '#831843',
    fontSize: 18,
    fontWeight: '500',
  },
  goalNumber: {
    color: '#831843',
    fontSize: 24,
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'center',
  },
  goalHint: {
    color: '#9D174D',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
});