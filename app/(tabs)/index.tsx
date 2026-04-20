import HabitCard from '@/components/HabitCard';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext, Habit } from '../_layout';

export default function IndexScreen() {
  const router = useRouter();
  const context = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!context) return null;

  const { habits, categories } = context;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Build category filter options from whatever categories exist in the db
  const categoryOptions = [
    'All',
    ...categories.map((c) => c.name),
  ];

  // Filter habits by search text and selected category
  const filteredHabits = habits.filter((habit: Habit) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      habit.name.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      selectedCategory === 'All' ||
      categories.find((c) => c.id === habit.category_id)?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Béas"
        subtitle={`${habits.length} habit${habits.length === 1 ? '' : 's'} tracked`}
      />

      <PrimaryButton
        label="Add Habit"
        onPress={() => router.push({ pathname: '/habit/add' })}
      />

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search habits..."
        style={styles.searchInput}
      />

      {/* Category filter pills */}
      <View style={styles.filterRow}>
        {categoryOptions.map((name) => {
          const isSelected = selectedCategory === name;
          return (
            <Pressable
              key={name}
              accessibilityLabel={`Filter by ${name}`}
              accessibilityRole="button"
              onPress={() => setSelectedCategory(name)}
              style={[
                styles.filterButton,
                isSelected && styles.filterButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  isSelected && styles.filterButtonTextSelected,
                ]}
              >
                {name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredHabits.length === 0 ? (
          <Text style={styles.emptyText}>No habits match your search</Text>
        ) : (
          filteredHabits.map((habit: Habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              category={categories.find((c) => c.id === habit.category_id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});