import HabitCard from '@/components/HabitCard';
import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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

  const categoryOptions = [
    'All',
    ...categories.map((c) => c.name),
  ];

  const filteredHabits = habits.filter((habit: Habit) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      habit.name.toLowerCase().includes(normalizedQuery);

    // Look up the category name by matching category_id
    const matchesCategory =
      selectedCategory === 'All' ||
      categories.find((c) => c.id === habit.category_id)?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // True when either the search box has text or a category filter is active
  // https://react.dev/learn/conditional-rendering
  const isFiltered = normalizedQuery.length > 0 || selectedCategory !== 'All';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
       <PinkHeader title="My Habits" />
      <View style={styles.searchWrapper}>
        <Feather name="search" size={16} color="#D4A0B0" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search habits..."
          placeholderTextColor="#D4A0B0"
          style={styles.searchInput}
        />
      </View>

      {/* Category filter pills — tapping one sets selectedCategory */}
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
         {/*  Two different empty states — one for when filters return no results, one for when no habits exist at all */}
         {/* https://react.dev/learn/conditional-rendering */}
        {filteredHabits.length === 0 ? (
          <View style={styles.emptyState}>
            {isFiltered ? (
              // Filters are active but nothing matches — give the user a way to reset
              <>
                <Text style={styles.emptyTitle}>No habits match your search</Text>
                <Text style={styles.emptySubtext}>Try clearing your search or selecting a different category</Text>
                <PrimaryButton
                  label="Clear Filters"
                  variant="secondary"
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                />
              </>
            ) : (
              // No habits exist at all — prompt the user to create their first one
              <>
                <Text style={styles.emptyTitle}>No habits yet</Text>
                <Text style={styles.emptySubtext}>Tap the + button to add your first habit</Text>
              </>
            )}
          </View>
        ) : (
          // Render a HabitCard for each habit that passes the filters
          filteredHabits.map((habit: Habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              // Category lookup using Array.find() with optional chaining
              // Matches each habit to its category by comparing category_id
              // React and React Native 5th Ed 2024 p.364
              category={categories.find((c) => c.id === habit.category_id)}
            />
          ))
        )}
      </ScrollView>

      {/* Floating action button — fixed to bottom right, navigates to add habit screen */}
      <Pressable
        accessibilityLabel="Add habit"
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/add' })}
        style={styles.fab}
      >
        <Feather name="plus" size={28} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FCF9FA',
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 14,
    paddingHorizontal: 18,
  },
  searchWrapper: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#FCE7F3',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 18,
    marginTop: 25,
    paddingHorizontal: 12,
    paddingVertical: 10,
},
  searchInput: {
    color: '#9D174D',
    flex: 1,
    fontSize: 15, 
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 18,

  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FCE7F3',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#831843',
    borderColor: '#831843',
  },
  filterButtonText: {
    color: '#831843',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 8,
  },
  emptyTitle: {
    color: '#831843',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#9D174D',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  fab: {
    alignItems: 'center',
    backgroundColor: '#EC4899',
    borderRadius: 999,
    bottom: 24,
    elevation: 4,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 60,
  },
});