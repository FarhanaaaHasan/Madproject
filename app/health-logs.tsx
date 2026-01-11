import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { HealthLog, healthLogService } from '@/lib/health-log-service';

export default function HealthLogsScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHealthLogs = async () => {
    setLoading(true);
    const { data, error } = await healthLogService.getHealthLogs();
    
    if (error) {
      Alert.alert('Error', 'Failed to load health logs');
      console.error('Error loading health logs:', error);
    } else if (data) {
      setLogs(data);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadHealthLogs();
    }, [])
  );

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Health Log',
      'Are you sure you want to delete this log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await healthLogService.deleteHealthLog(id);
            if (error) {
              Alert.alert('Error', 'Failed to delete health log');
            } else {
              setLogs(logs.filter((log) => log.id !== id));
            }
          },
        },
      ]
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Blood Pressure':
        return 'pulse';
      case 'Glucose (Fasting)':
        return 'water';
      case 'Weight':
        return 'stats-chart';
      case 'Heart Rate':
        return 'heart';
      default:
        return 'pulse';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'Blood Pressure':
        return '#d32f2f';
      case 'Glucose (Fasting)':
        return '#f57c00';
      case 'Weight':
        return '#388e3c';
      case 'Heart Rate':
        return '#1976d2';
      default:
        return '#999';
    }
  };

  const getLatestByType = (type: string) => {
    return logs.find((log) => log.type === type);
  };

  const bpLog = getLatestByType('Blood Pressure');
  const glucoseLog = getLatestByType('Glucose (Fasting)');
  const weightLog = getLatestByType('Weight');

  const renderItem = ({ item }: { item: HealthLog }) => (
    <View
      style={[
        styles.logCard,
        { borderLeftColor: getBorderColor(item.type), borderLeftWidth: 6 },
      ]}
    >
      <View style={styles.logContent}>
        <View style={styles.logHeader}>
          <Ionicons name={getIcon(item.type) as any} size={20} color="#000" />
          <ThemedText type="defaultSemiBold" style={styles.logType}>
            {item.type}
          </ThemedText>
        </View>
        <ThemedText style={styles.logValue}>
          Value: {item.value} {item.unit}
        </ThemedText>
        <ThemedText style={styles.logDate}>Date: {item.date}</ThemedText>
      </View>
      <View style={styles.logActions}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="pencil-outline" size={18} color="#666" />
        </Pressable>
        <Pressable onPress={() => handleDelete(item.id)} style={styles.iconButton}>
          <Ionicons name="trash-outline" size={18} color="#d9534f" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Health Logs
        </ThemedText>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accent} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            <View style={[styles.summaryCard, styles.pinkCard]}>
              <ThemedText style={styles.cardLabel}>Blood Pressure</ThemedText>
              <ThemedText style={styles.cardValue}>{bpLog?.value || 'N/A'}</ThemedText>
              <ThemedText style={styles.cardUnit}>{bpLog?.unit || 'mmHg'}</ThemedText>
            </View>

            <View style={[styles.summaryCard, styles.grayCard]}>
              <ThemedText style={styles.cardLabel}>Glucose</ThemedText>
              <ThemedText style={styles.cardValue}>{glucoseLog?.value || 'N/A'}</ThemedText>
              <ThemedText style={styles.cardUnit}>{glucoseLog?.unit || 'mg/dL'}</ThemedText>
            </View>

            <View style={[styles.summaryCard, styles.pinkCard]}>
              <ThemedText style={styles.cardLabel}>Weight</ThemedText>
              <ThemedText style={styles.cardValue}>{weightLog?.value || 'N/A'}</ThemedText>
              <ThemedText style={styles.cardUnit}>{weightLog?.unit || 'kg'}</ThemedText>
            </View>

            <View style={[styles.summaryCard, styles.grayCard]}>
              <ThemedText style={styles.cardLabel}>Total Logs</ThemedText>
              <ThemedText style={styles.cardValue}>{logs.length}</ThemedText>
            </View>
          </View>

        {/* Add Button */}
        <Pressable
          style={[styles.addButton, { backgroundColor: accent }]}
          onPress={() => router.push('/add-health-log')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.addButtonText}>Add Health Log</ThemedText>
        </Pressable>

        {/* Logs List */}
        <FlatList
          data={logs}
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
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#e8dce5' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  summaryCard: {
    width: '48%',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
  },
  pinkCard: {
    backgroundColor: '#d4b5c8',
  },
  grayCard: {
    backgroundColor: '#c5c5c5',
  },
  cardLabel: { fontSize: 11, color: '#8b5a7a', marginBottom: 8, fontWeight: '600' },
  cardValue: { fontSize: 22, fontWeight: '700', color: '#000' },
  cardUnit: { fontSize: 11, color: '#000', marginTop: 2 },

  // Add Button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Logs List
  list: { gap: 12, paddingBottom: 20 },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logContent: { flex: 1 },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  logType: { fontSize: 16, color: '#000' },
  logValue: { fontSize: 13, color: '#666', marginBottom: 2 },
  logDate: { fontSize: 12, color: '#999' },
  logActions: { flexDirection: 'row', gap: 12 },
  iconButton: { padding: 4 },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: { marginTop: 12, color: '#999' },
});
