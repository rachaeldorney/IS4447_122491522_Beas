import Logo from '@/components/Logo';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { users as usersTable } from '@/db/schema';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from './_layout';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const context = useContext(AppContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    // Find user by email
    // Drizzle select — https://orm.drizzle.team/docs/select
    const users = await db.select().from(usersTable);
    const user = users.find((u) => u.email === email && u.password === password);

    // If user is missing
    if (!user) {
      Alert.alert('Login failed', 'Incorrect email or password.');
      return;
    }

    // Set current user in context
  context?.setCurrentUser({ id: user.id, email: user.email });
  router.replace('/(tabs)' as any);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1A0A10' : '#FCF9FA' }]}>
     <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
        <View style={styles.logoSection}>
          <Logo size={80} />
          <Text style={styles.appName}>Béas</Text>
          <Text style={styles.tagline}>Build better habits</Text>
        </View>

        <View style={styles.form}>
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
          />
          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={true}
          />
        </View>

        <PrimaryButton label="Login" onPress={handleLogin} />

        <TouchableOpacity
          accessibilityLabel="Go to register"
          accessibilityRole="button"
          onPress={() => router.push('/register' as any)}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.registerLinkText}>Register</Text>
          </Text>
        </TouchableOpacity>
        </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 5,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  appName: {
    color: '#831843',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 16,
  },
  tagline: {
    color: '#9D174D',
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    marginBottom: 24,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  registerText: {
    color: '#9D174D',
    fontSize: 14,
  },
  registerLinkText: {
    color: '#EC4899',
    fontWeight: '600',
  },
});