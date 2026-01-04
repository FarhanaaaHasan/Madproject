import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function AddAppointmentScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    if (!title.trim() || !doctor.trim() || !date || !time) return;
    // Appointment would be saved here
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
            Add Appointment
          </ThemedText>
          <View style={styles.spacer} />
        </View>

        <View style={[styles.iconBox, { backgroundColor: `${accent}20` }]}>
          <Ionicons name="calendar-outline" size={48} color={accent} />
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Appointment Title
            </ThemedText>
            <View style={styles.inputRow}>
              <Ionicons name="text-outline" size={18} color={accent} />
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="E.g., General Checkup"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Doctor Name
            </ThemedText>
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={18} color={accent} />
              <TextInput
                style={styles.input}
                value={doctor}
                onChangeText={setDoctor}
                placeholder="E.g., Dr. Smith"
              />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.formGroup, { flex: 1 }]}>
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

            <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Time
              </ThemedText>
              <View style={styles.inputRow}>
                <Ionicons name="time-outline" size={18} color={accent} />
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={setTime}
                  placeholder="HH:MM AM/PM"
                />
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Location
            </ThemedText>
            <View style={styles.inputRow}>
              <Ionicons name="location-outline" size={18} color={accent} />
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Hospital / Clinic name"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Notes (Optional)
            </ThemedText>
            <TextInput
              style={[styles.textArea, { borderColor: accent }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes..."
              multiline
              numberOfLines={4}
            />
          </View>

          <Pressable
            style={[styles.button, { backgroundColor: accent }]}
            onPress={handleAdd}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <ThemedText style={styles.buttonText}>Schedule Appointment</ThemedText>
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
  form: { paddingHorizontal: 16, gap: 20, paddingBottom: 20 },
  formGroup: { gap: 10 },
  label: { fontSize: 14 },
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
  rowInputs: { flexDirection: 'row' },
  textArea: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 16,
    textAlignVertical: 'top',
  },
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
