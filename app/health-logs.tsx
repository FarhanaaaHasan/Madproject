import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

interface HealthLog {
  id: string;
  date: string;
  type: 'BP' | 'Glucose' | 'Weight';
  value: string;
  unit: string;
}

const MOCK_LOGS: HealthLog[] = [
  { id: '1', date: '2025-12-16', type: 'BP', value: '120/80', unit: 'mmHg' },
  { id: '2', date: '2025-12-15', type: 'Glucose', value: '110', unit: 'mg/dL' },
  { id: '3', date: '2025-12-14', type: 'Weight', value: '72', unit: 'kg' },
  { id: '4', date: '2025-12-13', type: 'BP', value: '118/76', unit: 'mmHg' },
];

export default function HealthLogsScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();
  const [logs, setLogs] = useState<HealthLog[]>(MOCK_LOGS);
  const [filterType, setFilterType] = useState<'All' | 'BP' | 'Glucose' | 'Weight'>('All');

  const filtered =
    filterType === 'All' ? logs : logs.filter((log) => log.type === filterType);

  const handleDelete = (id: string) => {
    setLogs(logs.filter((log) => log.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BP':
        return 'heart-outline';
      case 'Glucose':
        return 'flask-outline';
      case 'Weight':
        return 'scale-outline';
      default:
        return 'pulse-outline';
    }
  };

  const renderItem = ({ item }: { item: HealthLog }) => (
    <View style={styles.logCard}>
      <View style={[styles.logIcon, { backgroundColor: `${accent}20` }]}>
        <Ionicons name={getIcon(item.type) as any} size={24} color={accent} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold" style={styles.logType}>
          {item.type}
        </ThemedText>
        <ThemedText style={styles.logDate}>{item.date}</ThemedText>
      </View>
      <View style={styles.logValue}>
        <ThemedText type="defaultSemiBold" style={styles.value}>
          {item.value}
        </ThemedText>
        <ThemedText style={styles.unit}>{item.unit}</ThemedText>
      </View>
      <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={18} color="#d9534f" />
      </Pressable>
    </View>
  );

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Health Logs
        </ThemedText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {['All', 'BP', 'Glucose', 'Weight'].map((type) => (
          <Pressable
            key={type}
            onPress={() => setFilterType(type as any)}
            style={[
              styles.filterButton,
              filterType === type && { backgroundColor: accent },
            ]}
          >
            <ThemedText
              style={[
                styles.filterText,
                filterType === type && { color: '#fff' },
              ]}
            >
              {type}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="pulse-outline" size={48} color="#ccc" />
            <ThemedText style={styles.emptyText}>No health logs found</ThemedText>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      <Pressable
        style={[styles.fab, { backgroundColor: accent }]}
        onPress={() => router.push('/add-health-log')}
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
  filterScroll: { gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  filterButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  filterText: { fontWeight: '600', fontSize: 14 },
  list: { gap: 10, paddingHorizontal: 16, paddingBottom: 80 },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
  },
  logIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logType: { fontSize: 16, marginBottom: 4 },
  logDate: { fontSize: 12, color: '#999' },
  logValue: { alignItems: 'flex-end', marginRight: 8 },
  value: { fontSize: 16 },
  unit: { fontSize: 11, color: '#999' },
  deleteButton: { padding: 4 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
