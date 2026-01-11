import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TopHeader } from '@/components/top-header';
import { useAuth } from '@/hooks/use-auth';
import { useMedications } from '@/hooks/use-medications';
import { useThemeColor } from '@/hooks/use-theme-color';

interface MedicineDisplay {
  id: string;
  name: string;
  dosage: string;
  time: string;
  pills: string;
  tag: string;
  color: string;
}

// Color mapping for different types
const colorMap: { [key: string]: string } = {
  'Tablet': '#f9a8b8',
  'Capsule': '#f8c291',
  'Syrup': '#8ee3d0',
  'Drop': '#cbd5ff',
};

export default function MedicationsScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();
  const { user } = useAuth();
  const { medications, loading, refetch } = useMedications();
  const [search, setSearch] = useState('');

  // Refresh medications when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        refetch();
      }
    }, [user?.id, refetch])
  );

  // Convert Firestore medications to display format
  const medicinesDisplay: MedicineDisplay[] = medications.map((med) => ({
    id: med.id || '',
    name: med.name,
    dosage: med.dosage,
    time: med.notificationTimes?.[0] || 'TBD',
    pills: med.dosage,
    tag: med.mealTiming,
    color: colorMap[med.type] || '#f9a8b8',
  }));

  const filtered = medicinesDisplay.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.dosage.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: MedicineDisplay }) => (
    <Pressable
      style={styles.pillCard}
      onPress={() => router.push({ pathname: '/medicine-detail', params: { id: item.id } })}
    >
      <View style={[styles.pillLeft, { backgroundColor: item.color }]}>
        <Ionicons name="medkit" size={22} color="#fff" />
      </View>

      <View style={styles.pillMiddle}>
        <ThemedText style={styles.pillTime}>{item.time}</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.pillName}>{item.name}</ThemedText>
        <ThemedText style={styles.pillDosage}>{item.dosage}</ThemedText>
      </View>

      <View style={styles.pillRight}>
        <View style={[styles.tag, { backgroundColor: item.tag === 'Before eating' ? '#ffe6ea' : item.tag === 'During eating' ? '#fff5e6' : '#e6fff3' }]}>
          <ThemedText style={styles.tagText}>{item.tag}</ThemedText>
        </View>
        <ThemedText style={styles.pillCount}>{item.pills}</ThemedText>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.screen}>
      <TopHeader title="My Medications" />

      {/* Search Container */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medications..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color={accent} />
                <ThemedText style={styles.emptyText}>Loading medications...</ThemedText>
              </>
            ) : (
              <>
                <Ionicons name="medkit-outline" size={48} color="#ccc" />
                <ThemedText style={styles.emptyText}>
                  {search ? 'No medications found' : 'No medications yet. Tap + to add one!'}
                </ThemedText>
              </>
            )}
          </View>
        }
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={() => refetch()}
      />

      {/* Centered FAB */}
      <Pressable style={[styles.centerFab, { backgroundColor: accent }]} onPress={() => router.push('/add-medicine')}>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: 0, backgroundColor: '#f7fafc' },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerName: {
    fontSize: 14,
    color: '#20b2aa',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  list: { paddingHorizontal: 0, paddingTop: 12, paddingBottom: 120, gap: 12 },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  pillLeft: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pillMiddle: { flex: 1 },
  pillTime: { fontSize: 12, color: '#999', marginBottom: 4 },
  pillName: { fontSize: 15, marginBottom: 4 },
  pillDosage: { fontSize: 13, color: '#666' },
  pillRight: { alignItems: 'flex-end' },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginBottom: 8 },
  tagText: { fontSize: 11, color: '#b04b63' },
  pillCount: { fontSize: 12, color: '#666' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: { marginTop: 12, color: '#999' },
  centerFab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    borderWidth: 6,
    borderColor: '#f7fafc',
  },
});
