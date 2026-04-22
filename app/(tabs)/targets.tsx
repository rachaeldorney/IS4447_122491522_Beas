import PinkHeader from '@/components/ui/pink-header';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext, Target } from '../_layout';

export default function TargetsScreen() {
  const router = useRouter();
  const context = useContext(AppContext);

  if (!context) return null;

  const { targets, habits } = context;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <PinkHeader title="Targets" />

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {targets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No targets yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add your first target</Text>
          </View>
        ) : (
          targets.map((target: Target) => {
            const habit = habits.find((h) => h.id === target.habit_id);
            return (
              <Pressable
                key={target.id}
                accessibilityLabel={`${habit?.name ?? 'Target'}, view details`}
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/target/[id]', params: { id: target.id.toString() } })}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              >
                <View style={styles.leftRow}>
                  <Feather name="target" size={20} color="#EC4899" />
                  <View>
                    <Text style={styles.habitName}>{habit?.name ?? 'Unknown habit'}</Text>
                    <Text style={styles.targetDetail}>{target.goal}x {target.period}</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={18} color="#F9A8D4" />
              </Pressable>
            );
          })
        )}
      </ScrollView>

      {/* Floating action button — navigates to add target screen */}
      <Pressable
        accessibilityLabel="Add target"
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/target/add' })}
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
  habitName: {
    color: '#831843',
    fontSize: 16,
    fontWeight: '600',
  },
  targetDetail: {
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