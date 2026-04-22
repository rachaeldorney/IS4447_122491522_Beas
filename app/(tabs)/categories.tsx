import PinkHeader from '@/components/ui/pink-header';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext, Category } from '../_layout';

export default function CategoriesScreen() {
  const router = useRouter();
  const context = useContext(AppContext);

  if (!context) return null;

  const { categories, habits } = context;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
       <PinkHeader title="Categories" />

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.length === 0 ? (
          <Text style={styles.emptyTitle}>No categories yet</Text>
        ) : (
          categories.map((category: Category) => {
            // Count habits belonging to this category — same filter pattern as index.tsx
            const habitCount = habits.filter(
              (h) => h.category_id === category.id
            ).length;

            return (
              <Pressable
                key={category.id}
                accessibilityLabel={`${category.name}, view details`}
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/category/[id]', params: { id: category.id.toString() } })}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={styles.leftRow}>
                {/* Show the category icon in its colour, falling back to a folder icon */}
                <Feather
                    name={(category.icon ?? 'folder') as any}
                    size={20}
                    color={category.colour}
                />
                <Text style={styles.name}>{category.name}</Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
            {/* Floating action button — navigates to add category screen */}
      <Pressable
        accessibilityLabel="Add category"
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/category/add' })}
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
    paddingTop: 28,
    paddingHorizontal: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FCE7F3',
    borderRadius: 10,
    borderWidth: 1.5,
    marginBottom: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPressed: {
    opacity: 0.88,
  },
  leftRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  name: {
    color: '#831843',
    fontSize: 16,
    fontWeight: '600',
  },
  habitCount: {
    color: '#9D174D',
    fontSize: 13,
    marginTop: 2,
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