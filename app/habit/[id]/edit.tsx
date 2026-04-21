import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
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

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  // DropDownPicker state
  const [open, setOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState<number | null>(null);
  const [categoryItems, setCategoryItems] = useState<{ label: string; value: number }[]>([]);

  const habit = context?.habits.find((h: Habit) => h.id === Number(id));

  // Pre-fill all fields with the existing habit data when screen loads
  useEffect(() => {
    if (!habit) return;
    setName(habit.name);
    setDescription(habit.description ?? '');
    setDuration(habit.duration ? String(habit.duration) : '');
    setNotes(habit.notes ?? '');
    setCategoryValue(habit.category_id);
  }, [habit]);

  if (!context || !habit) return null;

  const { setHabits, categories } = context;

  // Build dropdown items from categories in context
  const dropdownItems = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const saveChanges = async () => {
    if (!categoryValue) return;

    // Update the habit in the database then refresh context
    await db
      .update(habitsTable)
      .set({
        name,
        description,
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Edit Habit" subtitle={`Update ${habit.name}`} />

        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />
          <FormField label="Duration (mins)" value={duration} onChangeText={setDuration} />
          <FormField label="Notes (optional)" value={notes} onChangeText={setNotes} />

          {/* Category dropdown — pre-selected with the habit's current category */}
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
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },
  content: {
    paddingBottom: 24,
  },
  form: {
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    marginTop: 4,
  },
  dropdownContainer: {
    borderColor: '#CBD5E1',
    borderRadius: 10,
  },
});