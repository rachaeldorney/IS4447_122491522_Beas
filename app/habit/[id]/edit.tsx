import FormField from '@/components/ui/form-field';
import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext, Habit } from '../../_layout';

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState<number | null>(null);
  const [categoryItems, setCategoryItems] = useState<{ label: string; value: number }[]>([]);

  const habit = context?.habits.find((h: Habit) => h.id === Number(id));

  // Pre-fill fields with existing habit data
  useEffect(() => {
    if (!habit) return;
    setName(habit.name);
    setDuration(habit.duration ? String(habit.duration) : '');
    setNotes(habit.notes ?? '');
    setCategoryValue(habit.category_id);
  }, [habit]);

  if (!context || !habit) return null;

  const { setHabits, categories } = context;

  const dropdownItems = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const saveChanges = async () => {
    if (!categoryValue) return;
    await db
      .update(habitsTable)
      .set({
        name,
        duration: duration ? Number(duration) : null,
        notes,
        category_id: categoryValue,
      })
      .where(eq(habitsTable.id, Number(id)));

    const rows = await db.select().from(habitsTable);
    setHabits(rows);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1A0A10' : '#FCF9FA' }]} edges={['bottom']}>
      <PinkHeader title="Edit Habit" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />
          <FormField label="Duration (mins)" value={duration} onChangeText={setDuration} />
          <FormField label="Notes (optional)" value={notes} onChangeText={setNotes} />
          <DropDownPicker
            open={open}
            value={categoryValue}
            items={dropdownItems}
            setOpen={setOpen}
            setValue={setCategoryValue}
            setItems={setCategoryItems}
            placeholder="Select a category"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            listMode="SCROLLVIEW"
          />
        </View>
        <PrimaryButton label="Save Changes" onPress={saveChanges} />
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
    paddingTop: 32,
    paddingBottom: 40,
  },
  form: {
    marginBottom: 24,
    gap: 8,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FCE7F3',
    borderRadius: 10,
  },
  dropdownContainer: {
    borderColor: '#FCE7F3',
    borderRadius: 10,
  },
});