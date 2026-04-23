import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, Text, TextInput, View } from 'react-native';


type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
};

export default function FormField({ label, value, onChangeText, placeholder, secureTextEntry }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';  
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholder={placeholder ?? ''}
        value={value}
        onChangeText={onChangeText}  secureTextEntry={secureTextEntry}

        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  label: {
    color: '#831843',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FCE7F3',
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});