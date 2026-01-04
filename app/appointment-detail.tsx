import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

interface Appointment {
  id: string;
  title: string;
  doctor: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
}

const MOCK_APPOINTMENT: Appointment = {
  id: '1',
  title: 'General Checkup',
  doctor: 'Dr. Smith',
  date: '2025-12-20',
  time: '10:00 AM',
  location: 'City Hospital',
  notes: 'Annual checkup',
};

export default function AppointmentDetailScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();

  const [appointment, setAppointment] = useState<Appointment>(MOCK_APPOINTMENT);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(appointment.title);
  const [editDoctor, setEditDoctor] = useState(appointment.doctor);
  const [editDate, setEditDate] = useState(appointment.date);
  const [editTime, setEditTime] = useState(appointment.time);
  const [editLocation, setEditLocation] = useState(appointment.location);
  const [editNotes, setEditNotes] = useState(appointment.notes || '');

  const handleSave = () => {
    setAppointment({
      ...appointment,
      title: editTitle,
      doctor: editDoctor,
      date: editDate,
      time: editTime,
      location: editLocation,
      notes: editNotes,
    });
    setIsEditing(false);
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>
          <ThemedText type="title" style={styles.title}>
            {isEditing ? 'Edit Appointment' : 'Appointment Details'}
          </ThemedText>
          <View style={styles.spacer} />
        </View>

        <View style={[styles.iconBox, { backgroundColor: `${accent}20` }]}>
          <Ionicons name="calendar" size={48} color={accent} />
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Title
              </ThemedText>
              <TextInput
                style={styles.input}
                value={editTitle}
                onChangeText={setEditTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Doctor
              </ThemedText>
              <TextInput style={styles.input} value={editDoctor} onChangeText={setEditDoctor} />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Date
              </ThemedText>
              <TextInput style={styles.input} value={editDate} onChangeText={setEditDate} />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Time
              </ThemedText>
              <TextInput style={styles.input} value={editTime} onChangeText={setEditTime} />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Location
              </ThemedText>
              <TextInput
                style={styles.input}
                value={editLocation}
                onChangeText={setEditLocation}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Notes
              </ThemedText>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={editNotes}
                onChangeText={setEditNotes}
                multiline
              />
            </View>

            <Pressable
              style={[styles.button, { backgroundColor: accent }]}
              onPress={handleSave}
            >
              <ThemedText style={styles.buttonText}>Save Changes</ThemedText>
            </Pressable>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="text-outline" size={20} color={accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={styles.detailLabel}>Title</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {appointment.title}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color={accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={styles.detailLabel}>Doctor</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {appointment.doctor}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={styles.detailLabel}>Date</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {appointment.date}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color={accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={styles.detailLabel}>Time</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {appointment.time}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color={accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={styles.detailLabel}>Location</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {appointment.location}
                </ThemedText>
              </View>
            </View>

            {appointment.notes && (
              <View style={styles.notesBox}>
                <ThemedText type="defaultSemiBold" style={styles.notesTitle}>
                  Notes
                </ThemedText>
                <ThemedText style={styles.notesText}>{appointment.notes}</ThemedText>
              </View>
            )}

            <View style={styles.actionButtons}>
              <Pressable
                style={[styles.button, { backgroundColor: accent }]}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="pencil" size={18} color="#fff" />
                <ThemedText style={styles.buttonText}>Edit</ThemedText>
              </Pressable>

              <Pressable style={[styles.button, styles.deleteButton]} onPress={() => router.back()}>
                <Ionicons name="trash" size={18} color="#fff" />
                <ThemedText style={styles.buttonText}>Delete</ThemedText>
              </Pressable>
            </View>
          </View>
        )}
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
  detailsContainer: { paddingHorizontal: 16, gap: 16 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
  },
  detailLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  detailValue: { fontSize: 16 },
  notesBox: {
    backgroundColor: '#fef0f5',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  notesTitle: { fontSize: 14, marginBottom: 8 },
  notesText: { fontSize: 14, color: '#666', lineHeight: 20 },
  editForm: { paddingHorizontal: 16, gap: 16, marginVertical: 16 },
  formGroup: { gap: 8 },
  label: { fontSize: 14 },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  multilineInput: { minHeight: 80, textAlignVertical: 'top' },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
  },
  deleteButton: { backgroundColor: '#d9534f' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
