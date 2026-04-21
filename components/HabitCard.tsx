import { Category, Habit } from '@/app/_layout';
import InfoTag from '@/components/ui/info-tag';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  habit: Habit;
  category: Category | undefined;
};

// Tappable card shown in the habits list — navigates to the habit detail screen on press
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
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.topRow}>
        {/* Coloured dot using the category colour */}
        <View style={[styles.dot, { backgroundColor: category?.colour ?? '#CBD5E1' }]} />
        <Text style={styles.name}>{habit.name}</Text>
      </View>

      <View style={styles.tags}>
        <InfoTag label="Category" value={category?.name ?? 'Uncategorised'} />
        {habit.description ? (
          <InfoTag label="Note" value={habit.description} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FCE7F3',
    borderRadius: 14,
    borderWidth: 1,
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
  },
  dot: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  name: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
});