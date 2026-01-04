import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

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

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    title: 'General Checkup',
    doctor: 'Dr. Smith',
    date: '2025-12-20',
    time: '10:00 AM',
    location: 'City Hospital',
    notes: 'Annual checkup',
  },
  {
    id: '2',
    title: 'Dental Appointment',
    doctor: 'Dr. Johnson',
    date: '2025-12-25',
    time: '02:00 PM',
    location: 'Dental Clinic',
  },
];

export default function AppointmentsScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  const renderItem = ({ item }: { item: Appointment }) => (
    <Pressable
      style={styles.appointmentCard}
      onPress={() => router.push({ pathname: '/appointment-detail', params: { id: item.id } })}
    >
      <View style={[styles.appointmentIcon, { backgroundColor: `${accent}20` }]}>
        <Ionicons name="calendar-outline" size={24} color={accent} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold" style={styles.appointmentTitle}>
          {item.title}
        </ThemedText>
        <View style={styles.appointmentMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={14} color="#666" />
            <ThemedText style={styles.metaText}>{item.doctor}</ThemedText>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <ThemedText style={styles.metaText}>{item.time}</ThemedText>
          </View>
        </View>
      </View>
      <Pressable
        onPress={() => handleDelete(item.id)}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <Ionicons name="trash-outline" size={20} color="#d9534f" />
      </Pressable>
    </Pressable>
  );

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Appointments
        </ThemedText>
      </View>

      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <ThemedText style={styles.emptyText}>No appointments scheduled</ThemedText>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      <Pressable
        style={[styles.fab, { backgroundColor: accent }]}
        onPress={() => router.push('/add-appointment')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  header: { paddingHorizontal: 16, marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  list: { gap: 10, paddingHorizontal: 16, paddingBottom: 80 },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f06292',
  },
  appointmentIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentTitle: { fontSize: 16, marginBottom: 6 },
  appointmentMeta: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#666' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: { marginTop: 12, color: '#999' },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
