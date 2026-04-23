import PinkHeader from '@/components/ui/pink-header';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { users as usersTable } from '@/db/schema';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Alert, Appearance, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from './_layout';

// Menu items with their route and icon
const MENU_ITEMS = [
  { label: 'Categories', icon: 'folder', route: '/categories' },
  { label: 'Targets', icon: 'target', route: '/targets' },
];

export default function MenuScreen() {
  const router = useRouter();
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

// Toggle between light and dark mode - https://reactnative.dev/docs/appearance
const handleThemeToggle = async () => {
  const handleThemeToggle = async () => {
  const current = Appearance.getColorScheme();
  const next = current === 'dark' ? 'light' : 'dark';
  Appearance.setColorScheme(next);
  await AsyncStorage.setItem('theme', next);
};

  const handleLogout = () => {
    // Clear current user from context and redirect to login
    context?.setCurrentUser(null);
    router.replace('/login' as any);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This will permanently delete your account and cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!context?.currentUser) return;
            // Delete user from database then log out
            await db.delete(usersTable).where(eq(usersTable.id, context.currentUser.id));
            context.setCurrentUser(null);
            router.replace('/login' as any);
          },
        },
      ]
    );
  };

  return (
  <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1A0A10' : '#FCF9FA' }]} edges={['bottom']}>
    <PinkHeader title="Menu" showBack />

    <View style={styles.list}>
      {MENU_ITEMS.map((item) => (
        <Pressable
          key={item.label}
          accessibilityLabel={item.label}
          accessibilityRole="button"
          onPress={() => router.push({ pathname: item.route as any })}
          style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
        >
          <Feather name={item.icon as any} size={20} color="#EC4899" />
          <Text style={styles.itemLabel}>{item.label}</Text>
          <Feather name="chevron-right" size={18} color="#F9A8D4" />
        </Pressable>
      ))}

      {/* Theme toggle */}
      <Pressable
        accessibilityLabel="Toggle dark mode"
        accessibilityRole="button"
        onPress={handleThemeToggle}
        style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
      >
        <Feather name={Appearance.getColorScheme() === 'dark' ? 'sun' : 'moon'} size={20} color="#EC4899" />
        <Text style={styles.itemLabel}>
          {Appearance.getColorScheme() === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Text>
        <Feather name="chevron-right" size={18} color="#F9A8D4" />
      </Pressable>
    </View>

    <View style={styles.bottomButtons}>
      <PrimaryButton label="Logout" variant="secondary" onPress={handleLogout} />
      <View style={styles.deleteButton}>
        <PrimaryButton label="Delete Account" variant="danger" onPress={handleDeleteAccount} />
      </View>
    </View>
  </SafeAreaView>
);
};

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
  bottomButtons: {
    marginTop: 'auto',
    paddingHorizontal: 40,
    paddingBottom: 24,
  },
  deleteButton: {
    marginTop: 10,
  },
});