import FormField from '@/components/ui/form-field';
import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../_layout';

// Colour options for the user to pick from when creating a category
const colours = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#82C91E',
  '#F59F00', '#CC5DE8', '#FF8787', '#748FFC',
  '#FF6B9D', '#38D9A9', '#74C0FC', '#A9E34B',
  '#FFC078', '#E599F7', '#63E6BE', '#F783AC',
];

// Icon options for the user to pick from when creating a category
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

export default function AddCategory() {
  const router = useRouter();
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [name, setName] = useState('');
  const [selectedColour, setSelectedColour] = useState(colours[0]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0].name);


  if (!context) return null;
  const { setCategories } = context;

  const saveCategory = async () => {
    if (!name) return;

    // Insert new category then refresh context
    await db.insert(categoriesTable).values({
      name,
      colour: selectedColour,
      user_id: 1,
      icon: selectedIcon,
    });

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1A0A10' : '#FCF9FA' }]} edges={['bottom']}>
     <PinkHeader title="Add Category" showBack />
        
      <View style={styles.content}>
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />

          {/* Colour picker — user taps a circle to select the category colour */}
          <Text style={styles.label}>Colour</Text>
          <View style={styles.colourRow}>
             {/* Array.map React and React Native 5th Ed 2024 p.330 */} 
            {colours.map((colour) => (
              <Pressable
                key={colour}
                accessibilityLabel={`Select colour ${colour}`}
                accessibilityRole="button"
                onPress={() => setSelectedColour(colour)}
                style={[
                  styles.colourDot,
                  { backgroundColor: colour },
                  // Conditional style — adds a border when this dot is the selected colour
                  selectedColour === colour && styles.colourDotSelected,
                ]}
              />
            ))}
          </View>

          {/* Icon picker — tapping an icon selects it for the category */}
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

        <PrimaryButton label="Save Category" onPress={saveCategory} />
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
    paddingHorizontal: 18,
    paddingTop: 32,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  form: {
    gap: 8,
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