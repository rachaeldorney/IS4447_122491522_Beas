import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
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
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Categories"
        subtitle={`${categories.length} categories`}
      />

      <PrimaryButton
        label="Add Category"
        onPress={() => router.push({ pathname: '/add' })}
      />

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.length === 0 ? (
          <Text style={styles.emptyText}>No categories yet</Text>
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
                onPress={() => router.push({ pathname: '/habit/[id]', params: { id: category.id.toString() } })}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={styles.leftRow}>
                  {/* Colour dot — uses the category's stored colour value */}
                  <View style={[styles.dot, { backgroundColor: category.colour }]} />
                  <Text style={styles.name}>{category.name}</Text>
                </View>
                <View style={styles.tags}>
                  <InfoTag label="Habits" value={String(habitCount)} />
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
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
    paddingBottom: 24,
    paddingTop: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  leftRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  dot: {
    borderRadius: 999,
    height: 12,
    width: 12,
  },
  name: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});