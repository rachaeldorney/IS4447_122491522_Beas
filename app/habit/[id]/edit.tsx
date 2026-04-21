import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext, Habit } from '../../_layout';

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(AppContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const habit = context?.habits.find((h: Habit) => h.id === Number(id));

  // Pre-fill the form with existing habit data when the screen loads
  useEffect(() => {
    if (!habit) return;
    setName(habit.name);
    setDescription(habit.description ?? '');
  }, [habit]);

  if (!context || !habit) return null;

  const { setHabits } = context;

  const saveChanges = async () => {
    // Update the habit in db then refresh context
    await db
      .update(habitsTable)
      .set({ name, description })
      .where(eq(habitsTable.id, Number(id)));

    const rows = await db.select().from(habitsTable);
    setHabits(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Edit Habit" subtitle={`Update ${habit.name}`} />
      <View style={styles.form}>
        <FormField label="Name" value={name} onChangeText={setName} />
        <FormField label="Description" value={description} onChangeText={setDescription} />
      </View>

      <PrimaryButton label="Save Changes" onPress={saveChanges} />
      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },
  form: {
    marginBottom: 6,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});