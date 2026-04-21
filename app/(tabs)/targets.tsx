import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../_layout';

export default function TargetsScreen() {
  const router = useRouter();
  const context = useContext(AppContext);

  if (!context) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Targets"
        subtitle="Your weekly and monthly goals"
      />

      <PrimaryButton
        label="Add Target"
        onPress={() => router.push({ pathname: '/add' })}
      />

      {/* Target cards will go here once targets are added to context */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.emptyText}>No targets yet</Text>
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
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});