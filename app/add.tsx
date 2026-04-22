import FormField from '@/components/ui/form-field';
import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from './_layout';

export default function AddHabit() {
  const router = useRouter();
  const context = useContext(AppContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');

  // DropDownPicker requires its own open/value/items state
  const [open, setOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState<number | null>(null);
  const [categoryItems, setCategoryItems] = useState<{ label: string; value: number }[]>([]);

  if (!context) return null;
  const { setHabits, categories } = context;

  // Build dropdown items from categories in context
  const dropdownItems = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const saveHabit = async () => {
    if (!categoryValue) return;

    // Insert new habit into the database with current date as created_at
    await db.insert(habitsTable).values({
      name,
      description,
      category_id: categoryValue,
      user_id: 1, // hardcoded until auth is implemented
      created_at: new Date().toISOString(),
    });

    // Refresh habits in context so the list updates immediately
    const rows = await db.select().from(habitsTable);
    setHabits(rows);
    router.back();
  };

  return (
  <SafeAreaView style={styles.safeArea} edges={['bottom']}>
    <PinkHeader title="Add Habit" showBack />
   
    <View style={styles.content}>
      <View style={styles.form}>
        <FormField label="Name" value={name} onChangeText={setName} />
        <FormField label="Duration" value={duration} onChangeText={setDuration} />
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
      <PrimaryButton label="Save Habit" onPress={saveHabit} />
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
    paddingHorizontal: 18,
    paddingBottom: 24,
    paddingTop: 32,
    justifyContent: 'space-between',
  },
  form: {
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FCE7F3',
    borderRadius: 8,
    marginTop: 4,
  },
  dropdownContainer: {
    borderColor: '#FCE7F3',
    borderRadius: 8,
  },
});