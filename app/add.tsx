import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from './_layout';

export default function AddHabit() {
  const router = useRouter();
  const context = useContext(AppContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');

  if (!context) return null;
  const { setHabits } = context;

  const saveHabit = async () => {
    // Insert the new habit then refresh the list in context
    await db.insert(habitsTable).values({
      name,
      description,
      category_id: Number(categoryId),
      user_id: 1, // hardcoded until auth is implemented
      created_at: new Date().toISOString(),
    });

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
        <ScreenHeader title="Add Habit" subtitle="Create a new habit to track." />
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />
          <FormField label="Description" value={description} onChangeText={setDescription} />
          <FormField label="Category ID" value={categoryId} onChangeText={setCategoryId} />
        </View>

        <PrimaryButton label="Save Habit" onPress={saveHabit} />
        <View style={styles.backButton}>
          <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
        </View>
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
    marginBottom: 6,
  },
  backButton: {
    marginTop: 10,
  },
});