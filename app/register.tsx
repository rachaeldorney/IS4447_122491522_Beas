import Logo from '@/components/Logo';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { users as usersTable } from '@/db/schema';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    // Check if email already exists
    const existing = await db.select().from(usersTable);
    const alreadyExists = existing.find((u) => u.email === email);

    if (alreadyExists) {
      Alert.alert('Email taken', 'An account with this email already exists.');
      return;
    }

    // Insert new user into the db - https://orm.drizzle.team/docs/insert
   await db.insert (usersTable).values({
      email,
      password,
      created_at: new Date().toISOString(),
    });

    Alert.alert('Account created', 'You can now log in.', [
      { text: 'Login', onPress: () => router.replace('/login' as any) },
    ]);
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
          <Text style={styles.tagline}>Create your account</Text>
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
            placeholder="Choose a password"
          />
          <FormField
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry={true}
          />
        </View>

        <PrimaryButton label="Create Account" onPress={handleRegister} />

        <TouchableOpacity
          accessibilityLabel="Go to login"
          accessibilityRole="button"
          onPress={() => router.replace('/login' as any)}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLinkText}>Login</Text>
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
  loginLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#9D174D',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#EC4899',
    fontWeight: '600',
  },
});