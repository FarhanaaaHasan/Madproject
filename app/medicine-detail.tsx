import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Medication, medicationService } from '@/lib/medication-service';

export default function MedicineDetailScreen() {
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [medicine, setMedicine] = useState<Medication | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState('');
  const [editDosage, setEditDosage] = useState('');
  const [editType, setEditType] = useState('');
  const [editFrequency, setEditFrequency] = useState('');
  const [editMealTiming, setEditMealTiming] = useState('');
  const [editDuration, setEditDuration] = useState('');

  // Load medicine data
  useEffect(() => {
    loadMedicineData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadMedicineData = async () => {
    if (!id) {
      Alert.alert('Error', 'Medicine ID not found');
      router.replace('/medications');
      return;
    }

    try {
      setLoading(true);
      const data = await medicationService.getMedicationById(id);
      if (data) {
        setMedicine(data);
        // Initialize form with existing data
        setEditName(data.name);
        setEditDosage(data.dosage);
        setEditType(data.type);
        setEditFrequency(data.frequency);
        setEditMealTiming(data.mealTiming);
        setEditDuration(data.duration);
      } else {
        Alert.alert('Error', 'Medicine not found');
        router.replace('/medications');
      }
    } catch (error) {
      console.error('[MedicineDetail] Error loading medicine:', error);
      Alert.alert('Error', 'Failed to load medicine details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!medicine?.id) return;

    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    setIsSaving(true);
    try {
      await medicationService.updateMedication(medicine.id, {
        name: editName.trim(),
        dosage: editDosage.trim(),
        type: editType,
        frequency: editFrequency,
        mealTiming: editMealTiming,
        duration: editDuration.trim(),
        // Keep original values for fields not being edited
        startDate: medicine.startDate,
        endDate: medicine.endDate,
        notificationTimes: medicine.notificationTimes,
      });

      Alert.alert('Success', 'Medication updated successfully');
      setIsEditing(false);
      router.replace('/medications');
    } catch (error: any) {
      console.error('[MedicineDetail] Error updating medicine:', error);
      const msg = error?.message || error?.hint || 'Failed to update medication';
      Alert.alert('Error', String(msg));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!medicine?.id) return;

    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: deleteConfirmed,
          style: 'destructive',
        },
      ]
    );
  };

  const deleteConfirmed = async () => {
    if (!medicine?.id) return;

    try {
      setLoading(true);
      await medicationService.deleteMedication(medicine.id);
      Alert.alert('Success', 'Medication deleted successfully');
      router.replace('/medications');
    } catch (error) {
      console.error('[MedicineDetail] Error deleting medicine:', error);
      Alert.alert('Error', 'Failed to delete medication');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): string | null => {
    if (!editName.trim()) return 'Medicine name is required';
    if (!editDosage.trim()) return 'Dosage is required';
    if (!editType) return 'Medicine type is required';
    if (!editFrequency) return 'Frequency is required';
    return null;
  };

  const initializeEdit = () => {
    if (medicine) {
      setEditName(medicine.name);
      setEditDosage(medicine.dosage);
      setEditType(medicine.type);
      setEditFrequency(medicine.frequency);
      setEditMealTiming(medicine.mealTiming);
      setEditDuration(medicine.duration);
      setIsEditing(true);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accent} />
        </View>
      </ThemedView>
    );
  }

  if (!medicine) {
    return (
      <ThemedView style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <ThemedText>Medicine not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable 
            onPress={() => {
              console.log('[MedicineDetail] Back button pressed');
              router.replace('/medications');
            }} 
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>
          <ThemedText type="title" style={styles.title}>
            {isEditing ? 'Edit Medication' : 'Medication Details'}
          </ThemedText>
          <View style={styles.spacer} />
        </View>

        <View style={[styles.iconBox, { backgroundColor: `${accent}20` }]}>
          <Ionicons name="medkit" size={48} color={accent} />
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Medicine Name
              </ThemedText>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter medicine name"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Type
              </ThemedText>
              <TextInput
                style={styles.input}
                value={editType}
                onChangeText={setEditType}
                placeholder="E.g., Tablet, Capsule, Syrup"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Dosage
              </ThemedText>
              <TextInput
                style={styles.input}
                value={editDosage}
                onChangeText={setEditDosage}
                placeholder="E.g., 500mg"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Frequency
              </ThemedText>
              <TextInput
                style={styles.input}
                value={editFrequency}
                onChangeText={setEditFrequency}
                placeholder="E.g., Daily, Weekly"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Meal Timing
              </ThemedText>
              <TextInput
                style={styles.input}
                value={editMealTiming}
                onChangeText={setEditMealTiming}
                placeholder="E.g., Before Breakfast"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Duration
              </ThemedText>
              <TextInput
                style={styles.input}
                value={editDuration}
                onChangeText={setEditDuration}
                placeholder="E.g., 30 days"
              />
            </View>

            <Pressable
              style={[styles.button, { backgroundColor: accent, opacity: isSaving ? 0.7 : 1 }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Save Changes</ThemedText>
              )}
            </Pressable>

            <Pressable
              style={[styles.button, { backgroundColor: '#999' }]}
              onPress={() => setIsEditing(false)}
              disabled={isSaving}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </Pressable>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="text-outline" size={20} color={accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={styles.detailLabel}>Medicine Name</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {medicine.name}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cube-outline" size={20} color={accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={styles.detailLabel}>Type</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {medicine.type}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="nutrition-outline" size={20} color={accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={styles.detailLabel}>Dosage</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {medicine.dosage}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color={accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={styles.detailLabel}>Frequency</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {medicine.frequency}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="restaurant-outline" size={20} color={accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={styles.detailLabel}>Meal Timing</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {medicine.mealTiming}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={accent} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={styles.detailLabel}>Duration</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {medicine.duration}
                </ThemedText>
              </View>
            </View>

            {medicine.notificationTimes && medicine.notificationTimes.length > 0 && (
              <View style={styles.detailRow}>
                <Ionicons name="notifications-outline" size={20} color={accent} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ThemedText style={styles.detailLabel}>Notification Times</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                    {medicine.notificationTimes.join(', ')}
                  </ThemedText>
                </View>
              </View>
            )}

            <View style={styles.actionButtons}>
              <Pressable
                style={[styles.button, { backgroundColor: accent }]}
                onPress={initializeEdit}
              >
                <Ionicons name="pencil" size={18} color="#fff" />
                <ThemedText style={styles.buttonText}>Edit</ThemedText>
              </Pressable>

              <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
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
  backButton: { padding: 12, marginLeft: -4 },
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: { paddingHorizontal: 16, gap: 16, paddingBottom: 40 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
  },
  detailLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  detailValue: { fontSize: 16 },
  editForm: { paddingHorizontal: 16, gap: 12, marginVertical: 16, paddingBottom: 40 },
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
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
    paddingHorizontal: 16,
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
