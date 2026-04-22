import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { Feather } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext, Target } from '../_layout';

export default function TargetDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(AppContext);

  if (!context) return null;

  const { targets, habits, setTargets } = context;
  const target = targets.find((t: Target) => t.id === Number(id));
  const habit = habits.find((h) => h.id === target?.habit_id);

  if (!target) return null;

  const period = target.period.charAt(0).toUpperCase() + target.period.slice(1);

  const deleteTarget = async () => {
    await db.delete(targetsTable).where(eq(targetsTable.id, Number(id)));
    
    const rows = await db.select().from(targetsTable);
    setTargets(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <PinkHeader title="Target Details" showBack />
      <View style={styles.content}>
        <View>
          <View style={styles.detailRow}>
            <Feather name="check-square" size={16} color="#9D174D" />
            <Text style={styles.detailText}>{habit?.name ?? 'Unknown habit'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="target" size={16} color="#9D174D" />
            <Text style={styles.detailText}>
              {target.goal} {target.goal === 1 ? 'time' : 'times'} {period}
            </Text>
          </View>
        </View>
        <PrimaryButton label="Delete Target" variant="danger" onPress={deleteTarget} />
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  detailText: {
    color: '#9D174D',
    fontSize: 15,
  },
});