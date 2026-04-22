import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { Feather } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext, Category } from '../_layout';

export default function CategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(AppContext);

  if (!context) return null;

  const { categories, habits, setCategories } = context;

  const category = categories.find((c: Category) => c.id === Number(id));

  if (!category) return null;


  const deleteCategory = async () => {
    // Delete category then refresh context
    await db.delete(categoriesTable).where(eq(categoriesTable.id, Number(id)));

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <PinkHeader title="Category Details" showBack />
      
      <View style={styles.content}>
        <View>
          {/* Category name with colour dot */}
          <View>
          {/* Category name with icon */}
          <View style={styles.nameRow}>
            <Feather
              name={(category.icon ?? 'folder') as any}
              size={24}
              color={category.colour}
            />
            <Text style={styles.categoryName}>{category.name}</Text>
          </View>

          {/* List each habit in this category */}
          <Text style={styles.sectionTitle}>Habits in this category</Text>
          {habits.filter((h) => h.category_id === category.id).length === 0 ? (
            <Text style={styles.detailText}>No habits in this category yet</Text>
          ) : (
            habits
              .filter((h) => h.category_id === category.id)
              .map((h) => (
                <View key={h.id} style={styles.habitRow}>
                  <Feather name="check-square" size={14} color="#9D174D" />
                  <Text style={styles.detailText}>{h.name}</Text>
                </View>
              ))
          )}
        </View>

        <PrimaryButton label="Delete Category" variant="danger" onPress={deleteCategory} />
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
    paddingTop: 28,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 999,
  },
  categoryName: {
    color: '#831843',
    fontSize: 24,
    fontWeight: '700',
  },
  detailText: {
    color: '#9D174D',
    fontSize: 15,
  },
  sectionTitle: {
  color: '#9D174D',
  fontSize: 11,
  fontWeight: '600',
  letterSpacing: 0.5,
  marginBottom: 12,
  marginTop: 4,
  textTransform: 'uppercase',
},
habitRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginBottom: 10,
},
});