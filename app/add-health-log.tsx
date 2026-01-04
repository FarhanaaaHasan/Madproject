import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function AddHealthLogScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();

  const [logType, setLogType] = useState<'BP' | 'Glucose' | 'Weight'>('BP');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAdd = () => {
    if (!value.trim()) return;
    // Log would be saved to local state or database here
    router.back();
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>
          <ThemedText type="title" style={styles.title}>
            Add Health Log
          </ThemedText>
          <View style={styles.spacer} />
        </View>

        <View style={[styles.iconBox, { backgroundColor: `${accent}20` }]}>
          <Ionicons name="pulse-outline" size={48} color={accent} />
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Log Type
            </ThemedText>
            <View style={styles.typeButtons}>
              {(['BP', 'Glucose', 'Weight'] as const).map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setLogType(type)}
                  style={[
                    styles.typeButton,
                    logType === type && { backgroundColor: accent },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.typeButtonText,
                      logType === type && { color: '#fff' },
                    ]}
                  >
                    {type}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Date
            </ThemedText>
            <View style={styles.inputRow}>
              <Ionicons name="calendar-outline" size={18} color={accent} />
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Value {logType === 'BP' && '(e.g., 120/80)'}
              {logType === 'Glucose' && '(mg/dL)'}
              {logType === 'Weight' && '(kg)'}
            </ThemedText>
            <View style={styles.inputRow}>
              <Ionicons
                name={
                  logType === 'BP'
                    ? 'heart-outline'
                    : logType === 'Glucose'
                      ? 'flask-outline'
                      : 'scale-outline'
                }
                size={18}
                color={accent}
              />
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                placeholder={
                  logType === 'BP' ? '120/80' : logType === 'Glucose' ? '110' : '72'
                }
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={accent} />
            <ThemedText style={styles.infoText}>
              {logType === 'BP' && 'Enter reading as Systolic/Diastolic'}
              {logType === 'Glucose' && 'Normal fasting glucose: 70-100 mg/dL'}
              {logType === 'Weight' && 'Enter your current weight'}
            </ThemedText>
          </View>

          <Pressable
            style={[styles.button, { backgroundColor: accent }]}
            onPress={handleAdd}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <ThemedText style={styles.buttonText}>Save Log Entry</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 8 },
  title: { fontSize: 24, fontWeight: '700', flex: 1, textAlign: 'center' },
  spacer: { width: 40 },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  form: { paddingHorizontal: 16, gap: 20 },
  formGroup: { gap: 10 },
  label: { fontSize: 14 },
  typeButtons: { flexDirection: 'row', gap: 10 },
  typeButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typeButtonText: { fontWeight: '600', fontSize: 14 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: { flex: 1, fontSize: 16, color: '#000' },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fef0f5',
    borderRadius: 10,
    padding: 12,
  },
  infoText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 18 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
    marginVertical: 20,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
