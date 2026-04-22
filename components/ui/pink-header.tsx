import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  showBack?: boolean;
  rightIcon?: 'edit-2' | 'menu';
  onRightPress?: () => void;
};

// Reusable pink header used across all screens
export default function PinkHeader({ title, showBack = false, rightIcon, onRightPress }: Props) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {showBack ? (
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.sideButton}
        >
          <Feather name="arrow-left" size={24} color="#831843" />
        </Pressable>
      ) : (
        <View style={styles.sideButton} />
      )}

      <Text style={styles.title}>{title}</Text>

      {rightIcon ? (
        <Pressable
          accessibilityLabel={rightIcon}
          accessibilityRole="button"
          onPress={onRightPress}
          style={styles.sideButton}
        >
          <Feather name={rightIcon} size={22} color="#831843" />
        </Pressable>
      ) : (
        <View style={styles.sideButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F9A8D4',
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#831843',
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  sideButton: {
    width: 32,
    alignItems: 'center',
  },
});