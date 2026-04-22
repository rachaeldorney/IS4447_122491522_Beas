import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Menu items with their route and icon
const MENU_ITEMS = [
  { label: 'Categories', icon: 'folder', route: '/categories' },
  { label: 'Targets', icon: 'target', route: '/targets' },
];

export default function MenuScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}edges={['bottom']} >
         <PinkHeader title="Menu" showBack />

      <View style={styles.list}>
        {MENU_ITEMS.map((item) => (
          <Pressable
            key={item.label}
            accessibilityLabel={item.label}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: item.route as any })}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
          >
            <Feather name={item.icon as any} size={20} color="#EC4899" />
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Feather name="chevron-right" size={18} color="#F9A8D4" />
          </Pressable>
        ))}
      </View>

      <View style={styles.logoutButton}>
        <PrimaryButton
          label="Logout"
          variant="danger"
          onPress={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fcf9fa',
    flex: 1,
  },
  list: {
    marginTop: 16,
    paddingHorizontal: 18,
  },
  item: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#FCE7F3',
    borderRadius: 10,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    padding: 16,
  },
  itemPressed: {
    opacity: 0.88,
  },
  itemLabel: {
    color: '#831843',
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 'auto',
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
});