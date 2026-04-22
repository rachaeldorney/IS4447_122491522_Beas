import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../_layout';

// Period options for the target
const periods = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

export default function AddTarget() {
  const router = useRouter();
  const context = useContext(AppContext);

  const [goal, setGoal] = useState(1);
  const [period, setPeriod] = useState<string>('weekly');
  const [open, setOpen] = useState(false);
  const [habitOpen, setHabitOpen] = useState(false);
  const [habitValue, setHabitValue] = useState<number | null>(null);
  const [habitItems, setHabitItems] = useState<{ label: string; value: number }[]>([]);

  if (!context) return null;
  const { habits, setTargets } = context;

  // Build dropdown items from habits in context
  const habitDropdownItems = habits.map((h) => ({
    label: h.name,
    value: h.id,
  }));

  const saveTarget = async () => {
    if (!habitValue) return;

    // Insert new target then go back
    await db.insert(targetsTable).values({
      user_id: 1,
      habit_id: habitValue,
      period,
      goal,
    });

    // Refresh targets in context so the list updates immediately
    const rows = await db.select().from(targetsTable);
    setTargets(rows);

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <PinkHeader title="Add Target" showBack />

      <View style={styles.content}>
        <View style={styles.form}>

          {/* Habit picker — select which habit this target applies to */}
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

          {/* Period picker — daily, weekly or monthly */}
          <Text style={[styles.label, { marginTop: 16 }]}>Period</Text>
          <View style={styles.periodRow}>
            {periods.map((p) => {
              const isSelected = period === p.value;
              return (
                <Pressable
                  key={p.value}
                  accessibilityLabel={`Select ${p.label}`}
                  accessibilityRole="button"
                  onPress={() => setPeriod(p.value)}
                  style={[
                    styles.periodButton,
                    isSelected && styles.periodButtonSelected,
                  ]}
                >
                  <Text style={[
                    styles.periodButtonText,
                    isSelected && styles.periodButtonTextSelected,
                  ]}>
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Goal number picker — increment and decrement buttons */}
          <Text style={[styles.label, { marginTop: 16 }]}>Goal</Text>
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
            Complete this habit {goal} {goal === 1 ? 'time' : 'times'} {period}
          </Text>
        </View>

        <PrimaryButton label="Save Target" onPress={saveTarget} />
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
    paddingTop: 35,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  form: {
    gap: 24,
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