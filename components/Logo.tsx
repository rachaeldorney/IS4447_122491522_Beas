import { StyleSheet, Text, View } from 'react-native';

export default function Logo({ size = 80 }: { size?: number }) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size * 0.23 }]}>
      <Text style={[styles.letter, { fontSize: size * 0.52 }]}>B</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#831843',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: '#F9A8D4',
    fontWeight: '700',
    fontFamily: 'serif',
  },
});