import { Category, Habit } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  habit: Habit;
  category: Category | undefined;
};

export default function HabitCard({ habit, category }: Props) {
  const router = useRouter();
  const openDetails = () =>
    router.push({ pathname: '/habit/[id]', params: { id: habit.id.toString() } });

  return (
    <Pressable
      accessibilityLabel={`${habit.name}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.dot, { backgroundColor: category?.colour ?? '#CBD5E1' }]} />
        <Text style={styles.name}>{habit.name}</Text>
      </View>
      <Text style={styles.category}>{category?.name ?? 'Uncategorised'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F9A8D4',
    borderRadius: 10,
    borderWidth: 1.5,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  dot: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  name: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    color: '#9D174D',
    fontSize: 13,
    marginLeft: 18,
  },
});