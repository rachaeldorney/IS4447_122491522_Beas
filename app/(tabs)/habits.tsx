import HabitCard from '@/components/HabitCard';
import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext, Habit } from '../_layout';

export default function IndexScreen() {
  const router = useRouter();
  const context = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('all');

  // DropDownPicker state for category filter
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState<string | null>(null);
  const [categoryItems, setCategoryItems] = useState<{ label: string; value: string }[]>([]);

  if (!context) return null;

  const { habits, categories } = context;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Build category dropdown items from context
  const categoryDropdownItems = [
    { label: 'All Categories', value: 'all' },
    ...categories.map((c) => ({ label: c.name, value: c.name })),
  ];

  const dateOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
  ];

  const today = new Date().toISOString().split('T')[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const monthStart = new Date();
  monthStart.setDate(1);
  const monthStartStr = monthStart.toISOString().split('T')[0];


  const filteredHabits = habits.filter((habit: Habit) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      habit.name.toLowerCase().includes(normalizedQuery);

    // Look up the category name by matching category_id
    // React and React Native 5th Ed 2024 p.364
    const matchesCategory =
       !categoryValue || categoryValue === 'all' ||
      categories.find((c) => c.id === habit.category_id)?.name === categoryValue;

    // Filter by date habit was created
    const matchesDate =
      selectedDate === 'all' ||
      (selectedDate === 'today' && habit.created_at.startsWith(today)) ||
      (selectedDate === 'week' && habit.created_at >= weekStartStr) ||
      (selectedDate === 'month' && habit.created_at >= monthStartStr);

    return matchesSearch && matchesCategory && matchesDate;
  });

  // True when any filter is active
  // https://react.dev/learn/conditional-rendering
  const isFiltered = normalizedQuery.length > 0 || (categoryValue !== null && categoryValue !== 'all') || selectedDate !== 'all';

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

     <View style={styles.filterSection}>
        {/* Category dropdown */}
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={categoryOpen}
            value={categoryValue}
            items={categoryDropdownItems}
            setOpen={setCategoryOpen}
            setValue={setCategoryValue}
            setItems={setCategoryItems}
            placeholder="Category"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            listMode="SCROLLVIEW"
            zIndex={3000}
          />
        </View>

        {/* Date filter pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datePills}>
          {dateOptions.map((option) => {
            const isSelected = selectedDate === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityLabel={`Filter by ${option.label}`}
                accessibilityRole="button"
                onPress={() => setSelectedDate(option.value)}
                style={[styles.dateButton, isSelected && styles.dateButtonSelected]}
              >
                <Text style={[styles.dateButtonText, isSelected && styles.dateButtonTextSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Two different empty states */}
        {/* https://react.dev/learn/conditional-rendering */}
        {filteredHabits.length === 0 ? (
          <View style={styles.emptyState}>
            {isFiltered ? (
              <>
                <Text style={styles.emptyTitle}>No habits match your search</Text>
                <Text style={styles.emptySubtext}>Try clearing your search or selecting a different category</Text>
                <PrimaryButton
                  label="Clear Filters"
                  variant="secondary"
                  onPress={() => {
                    setSearchQuery('');
                    setCategoryValue(null);
                    setSelectedDate('all');
                  }}
                />
              </>
            ) : (
              <>
                <Text style={styles.emptyTitle}>No habits yet</Text>
                <Text style={styles.emptySubtext}>Tap the + button to add your first habit</Text>
              </>
            )}
          </View>
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

      {/* Floating action button */}
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
  filterSection: {
    marginTop: 12,
    marginHorizontal: 18,
    gap: 10,
    zIndex: 3000,
  },
  dropdownWrapper: {
    zIndex: 3000,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FCE7F3',
    borderRadius: 8,
    borderWidth: 1,
  },
  dropdownContainer: {
    borderColor: '#FCE7F3',
    borderRadius: 8,
  },
  datePills: {
    flexDirection: 'row',
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FCE7F3',
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateButtonSelected: {
    backgroundColor: '#831843',
    borderColor: '#831843',
  },
  dateButtonText: {
    color: '#831843',
    fontSize: 13,
    fontWeight: '500',
  },
  dateButtonTextSelected: {
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