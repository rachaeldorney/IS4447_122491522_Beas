import HabitCard from '@/components/HabitCard';
import PrimaryButton from '@/components/ui/primary-button';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
  const isFiltered = normalizedQuery.length > 0 || selectedCategory !== 'All';

  return (
    <SafeAreaView style={styles.safeArea}>
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search habits..."
        style={styles.searchInput}
      />

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
    backgroundColor: '#FFF0F7',
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 100,
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
    backgroundColor: '#831843',
    borderColor: '#831843',
  },
  filterButtonText: {
    color: '#0F172A',
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
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#6B7280',
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