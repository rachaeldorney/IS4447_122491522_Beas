import FormField from '@/components/ui/form-field';
import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { Feather } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext, Category } from '../../_layout';

const colours = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#82C91E',
  '#F59F00', '#CC5DE8', '#FF8787', '#748FFC',
  '#FF6B9D', '#38D9A9', '#74C0FC', '#A9E34B',
  '#FFC078', '#E599F7', '#63E6BE', '#F783AC',
];

const icons: { name: string; label: string }[] = [
  { name: 'heart', label: 'Health' },
  { name: 'activity', label: 'Fitness' },
  { name: 'book', label: 'Learning' },
  { name: 'coffee', label: 'Lifestyle' },
  { name: 'sun', label: 'Wellness' },
  { name: 'music', label: 'Hobbies' },
  { name: 'briefcase', label: 'Work' },
  { name: 'home', label: 'Home' },
  { name: 'dollar-sign', label: 'Finance' },
  { name: 'smile', label: 'Mindfulness' },
  { name: 'zap', label: 'Energy' },
  { name: 'star', label: 'Goals' },
  { name: 'check-circle', label: 'Organisation' },
  { name: 'clock', label: 'Routine' },
  { name: 'droplet', label: 'Hydration' },
  { name: 'moon', label: 'Sleep' },
  { name: 'wind', label: 'Breathing' },
  { name: 'book-open', label: 'Reading' },
  { name: 'pen-tool', label: 'Journaling' },
  { name: 'shopping-bag', label: 'Shopping' },
  { name: 'feather', label: 'Skincare' },
];

export default function EditCategory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(AppContext);
  const [name, setName] = useState('');
  const [selectedColour, setSelectedColour] = useState(colours[0]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0].name);

  const category = context?.categories.find((c: Category) => c.id === Number(id));

  // Pre-fill form with existing category data
  useEffect(() => {
    if (!category) return;
    setName(category.name);
    setSelectedColour(category.colour);
    setSelectedIcon(category.icon ?? icons[0].name);
  }, [category]);

  if (!context || !category) return null;

  const { setCategories } = context;

  const saveChanges = async () => {
    await db
      .update(categoriesTable)
      .set({ name, colour: selectedColour, icon: selectedIcon })
      .where(eq(categoriesTable.id, Number(id)));

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <PinkHeader title="Edit Category" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />

          <Text style={styles.label}>Colour</Text>
          <View style={styles.colourRow}>
            {colours.map((colour) => (
              <Pressable
                key={colour}
                accessibilityLabel={`Select colour ${colour}`}
                accessibilityRole="button"
                onPress={() => setSelectedColour(colour)}
                style={[
                  styles.colourDot,
                  { backgroundColor: colour },
                  selectedColour === colour && styles.colourDotSelected,
                ]}
              />
            ))}
          </View>

          <Text style={styles.label}>Icon</Text>
          <View style={styles.iconRow}>
            {icons.map((icon) => {
              const isSelected = selectedIcon === icon.name;
              return (
                <Pressable
                  key={icon.name}
                  accessibilityLabel={`Select icon ${icon.label}`}
                  accessibilityRole="button"
                  onPress={() => setSelectedIcon(icon.name)}
                  style={[
                    styles.iconButton,
                    isSelected && { backgroundColor: selectedColour },
                  ]}
                >
                  <Feather
                    name={icon.name as any}
                    size={20}
                    color={isSelected ? '#FFFFFF' : '#9D174D'}
                  />
                </Pressable>
              );
            })}
          </View>
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
    gap: 8,
  },
  form: {
    gap: 8,
    marginBottom: 24,
  },
  label: {
    color: '#831843',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },
  colourRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colourDot: {
    borderRadius: 999,
    height: 36,
    width: 36,
  },
  colourDotSelected: {
    borderColor: '#831843',
    borderWidth: 3,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#FCE7F3',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});