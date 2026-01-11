import SuccessModal from '@/components/success-modal';
import { TopHeader } from '@/components/top-header';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { medicationService } from '@/lib/medication-service';

const frequencies = ['Daily', 'Weekly', 'Monthly'];
const times = ['Before Breakfast', 'After Breakfast', 'Before Lunch', 'After Dinner'];
const pillTypes = ['Tablet', 'Capsule', 'Syrup', 'Drop'];

export default function AddMedicineScreen() {
  const router = useRouter();
  const accent = useThemeColor({ light: '#f06292', dark: '#f8a2c1' }, 'tint');
  const cardBg = useThemeColor({ light: '#fdf5f9', dark: '#111' }, 'background');
  const { user } = useAuth();
  
  const [selectedFreq, setSelectedFreq] = useState('Daily');
  const [selectedMeal, setSelectedMeal] = useState('After Dinner');
  const [selectedType, setSelectedType] = useState('Tablet');
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [timesSelected, setTimesSelected] = useState<string[]>(['8:00 AM', '5:00 PM']);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const nextTimeLabel = useMemo(() => `${7 + timesSelected.length}:00 AM`, [timesSelected.length]);

  const toggleTime = (label: string) => {
    setTimesSelected((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const addTime = () => {
    if (timesSelected.includes(nextTimeLabel)) return;
    setTimesSelected((prev) => [...prev, nextTimeLabel]);
  };

  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (showDatePicker === 'start') {
      setStartDate(dateStr);
    } else if (showDatePicker === 'end') {
      setEndDate(dateStr);
    }
    setShowDatePicker(null);
  };

  const renderCalendar = () => {
    const currentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const firstDayOfWeek = currentMonth.getDay();
    const days = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleSave = async () => {
    if (!medicineName.trim()) {
      Alert.alert('Missing name', 'Please enter the medicine name.');
      return;
    }
    if (!dosage.trim()) {
      Alert.alert('Missing dosage', 'Please add a dosage (e.g., 750 mg).');
      return;
    }
    if (!timesSelected.length) {
      Alert.alert('No times selected', 'Please pick at least one notification time.');
      return;
    }
    if (!startDate) {
      Alert.alert('Missing date', 'Please select a start date.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to add medications.');
      return;
    }

    setIsLoading(true);
    try {
      await medicationService.addMedication({
        userId: user.id,
        name: medicineName.trim(),
        type: selectedType,
        dosage: dosage.trim(),
        duration: duration.trim() || 'Ongoing',
        frequency: selectedFreq,
        mealTiming: selectedMeal,
        notificationTimes: timesSelected,
        startDate: startDate,
        endDate: endDate || undefined,
      });
      
      console.log('[AddMedicine] Successfully saved medication');
      setShowSuccess(true);
      
      // Reset form
      setMedicineName('');
      setDosage('');
      setDuration('');
      setTimesSelected(['8:00 AM', '5:00 PM']);
      setSelectedType('Tablet');
      setSelectedFreq('Daily');
      setSelectedMeal('After Dinner');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
    } catch (error: any) {
      const msg = error?.message || error?.error_description || error?.hint || 'Failed to save medication. Please try again.';
      console.error('[AddMedicine] Error saving medication:', error);
      Alert.alert('Error', String(msg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <TopHeader 
        title="Add Medicine" 
        right={
          <Pressable onPress={() => router.replace('/')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#444" />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <ThemedView style={[styles.hero, { backgroundColor: accent }]}>
          <ThemedText type="title" style={styles.heroTitle}>
            Add Medicine
          </ThemedText>
          <View style={styles.heroPill}>
            <Ionicons name="information-circle-outline" size={16} color={accent} />
            <ThemedText style={styles.heroPillText}>Save and set reminders next</ThemedText>
          </View>
          <View style={styles.heroStats}>
            <View style={styles.heroStatBox}>
              <ThemedText style={styles.heroStatLabel}>This week</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.heroStatValue}>
                6 doses
              </ThemedText>
            </View>
            <View style={styles.heroStatBox}>
              <ThemedText style={styles.heroStatLabel}>Adherence</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.heroStatValue}>
                88%
              </ThemedText>
            </View>
            <View style={styles.heroStatBox}>
              <ThemedText style={styles.heroStatLabel}>Refills</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.heroStatValue}>
                In 12 days
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Medicine details</ThemedText>
          <View style={styles.inputRow}>
            <Ionicons name="medkit-outline" size={18} color={accent} />
            <TextInput
              style={styles.input}
              placeholder="Medicine name"
              placeholderTextColor="#9aa"
              value={medicineName}
              onChangeText={setMedicineName}
            />
          </View>
          <View style={styles.chipRow}>
            {pillTypes.map((type) => {
              const active = selectedType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setSelectedType(type)}
                  style={[
                    styles.chip,
                    { backgroundColor: active ? `${accent}22` : cardBg, borderColor: active ? accent : '#d9e6ec' },
                  ]}>
                  <ThemedText style={[styles.chipText, active && { color: accent }]}>{type}</ThemedText>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.inlineInputs}>
            <View style={styles.inlineField}>
              <ThemedText style={styles.label}>Dosage</ThemedText>
              <View style={styles.inputRow}>
                <Ionicons name="thermometer-outline" size={18} color={accent} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 750 mg"
                  placeholderTextColor="#9aa"
                  value={dosage}
                  onChangeText={setDosage}
                />
              </View>
            </View>
            <View style={styles.inlineField}>
              <ThemedText style={styles.label}>Duration</ThemedText>
              <View style={styles.inputRow}>
                <Ionicons name="calendar-outline" size={18} color={accent} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 26 days"
                  placeholderTextColor="#9aa"
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
            </View>
          </View>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Food & timing</ThemedText>
          <View style={styles.chipRow}>
            {times.map((time) => {
              const active = selectedMeal === time;
              return (
                <Pressable
                  key={time}
                  onPress={() => setSelectedMeal(time)}
                  style={[
                    styles.iconChip,
                    { borderColor: active ? accent : '#d9e6ec', backgroundColor: active ? `${accent}15` : cardBg },
                  ]}>
                  <Ionicons name="restaurant-outline" size={16} color={accent} />
                  <ThemedText style={[styles.chipText, active && { color: accent }]}>{time}</ThemedText>
                </Pressable>
              );
            })}
          </View>
          <ThemedText type="subtitle">Frequency</ThemedText>
          <View style={styles.chipRow}>
            {frequencies.map((freq) => {
              const active = selectedFreq === freq;
              return (
                <Pressable
                  key={freq}
                  onPress={() => setSelectedFreq(freq)}
                  style={[
                    styles.chip,
                    { borderColor: active ? accent : '#d9e6ec', backgroundColor: active ? accent : cardBg },
                  ]}>
                  <ThemedText style={[styles.chipText, active ? styles.chipTextActive : undefined]}>{freq}</ThemedText>
                </Pressable>
              );
            })}
          </View>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Notification</ThemedText>
          <View style={styles.timeRow}>
            {['7:00 AM', '8:00 AM', '5:00 PM', '9:00 PM'].map((time) => {
              const active = timesSelected.includes(time);
              return (
                <Pressable
                  key={time}
                  style={[
                    styles.timeChip,
                    { borderColor: active ? accent : '#d9e6ec', backgroundColor: active ? `${accent}14` : '#f5fbff' },
                  ]}
                  onPress={() => toggleTime(time)}>
                  <Ionicons name="time-outline" size={14} color={accent} />
                  <ThemedText style={[styles.chipText, { color: accent }]}>{time}</ThemedText>
                </Pressable>
              );
            })}
            <Pressable
              style={[styles.timeChip, { borderStyle: 'dashed', borderColor: '#d9e6ec' }]}
              onPress={addTime}>
              <Ionicons name="time-outline" size={14} color={accent} />
              <ThemedText style={[styles.chipText, { color: accent }]}>Add {nextTimeLabel}</ThemedText>
            </Pressable>
          </View>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Medication Period</ThemedText>
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <ThemedText style={styles.label}>Start Date</ThemedText>
              <Pressable 
                style={[styles.dateButton, { borderColor: accent }]}
                onPress={() => {
                  setSelectedDate(new Date(startDate || new Date()));
                  setShowDatePicker('start');
                }}
              >
                <Ionicons name="calendar-outline" size={18} color={accent} />
                <ThemedText style={styles.dateButtonText}>{startDate}</ThemedText>
              </Pressable>
            </View>

            <View style={styles.dateField}>
              <ThemedText style={styles.label}>End Date (Optional)</ThemedText>
              <Pressable 
                style={[styles.dateButton, { borderColor: endDate ? accent : '#d9e6ec' }]}
                onPress={() => {
                  setSelectedDate(new Date(endDate || new Date()));
                  setShowDatePicker('end');
                }}
              >
                <Ionicons name="calendar-outline" size={18} color={endDate ? accent : '#9aa'} />
                <ThemedText style={[styles.dateButtonText, { color: endDate ? '#000' : '#9aa' }]}>
                  {endDate || 'Not set'}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ThemedView>

        <Pressable 
          style={[styles.primaryButton, { backgroundColor: accent, opacity: isLoading ? 0.7 : 1 }]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.primaryButtonText}>Save medicine</ThemedText>
          )}
        </Pressable>

        <SuccessModal visible={showSuccess} onClose={() => setShowSuccess(false)} backTo="/" />

        {/* Calendar Picker Modal */}
        <Modal
          visible={showDatePicker !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
                  {showDatePicker === 'start' ? 'Select Start Date' : 'Select End Date'}
                </ThemedText>
                <Pressable onPress={() => setShowDatePicker(null)}>
                  <Ionicons name="close" size={24} color="#333" />
                </Pressable>
              </View>

              <View style={styles.calendarContainer}>
                {/* Month/Year Navigation */}
                <View style={styles.monthHeader}>
                  <Pressable onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}>
                    <Ionicons name="chevron-back" size={24} color={accent} />
                  </Pressable>
                  <ThemedText type="defaultSemiBold" style={styles.monthText}>
                    {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </ThemedText>
                  <Pressable onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}>
                    <Ionicons name="chevron-forward" size={24} color={accent} />
                  </Pressable>
                </View>

                {/* Days of week header */}
                <View style={styles.daysOfWeekRow}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <ThemedText key={day} style={styles.dayOfWeekText}>{day}</ThemedText>
                  ))}
                </View>

                {/* Calendar grid */}
                <View style={styles.calendarGrid}>
                  {renderCalendar().map((day, index) => (
                    <Pressable
                      key={index}
                      style={[
                        styles.calendarDay,
                        day === selectedDate.getDate() && selectedDate.getMonth() === new Date(startDate || endDate).getMonth() && {
                          backgroundColor: accent,
                        },
                      ]}
                      onPress={() => {
                        if (day) {
                          const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                          handleDateSelect(newDate);
                        }
                      }}
                    >
                      {day && (
                        <ThemedText
                          style={[
                            styles.calendarDayText,
                            day === selectedDate.getDate() && selectedDate.getMonth() === new Date(startDate || endDate).getMonth() && {
                              color: '#fff',
                            },
                          ]}
                        >
                          {day}
                        </ThemedText>
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.modalFooter}>
                <Pressable
                  style={[styles.modalButton, { backgroundColor: '#f0f0f0' }]}
                  onPress={() => setShowDatePicker(null)}
                >
                  <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  hero: {
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  heroPillText: {
    color: '#f06292',
    fontSize: 12,
    fontWeight: '600',
  },
  heroStats: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  heroStatBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  heroStatLabel: {
    color: '#ffffff99',
    fontSize: 12,
    marginBottom: 4,
  },
  heroStatValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fdf5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f5dce8',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    color: '#2b3a42',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: '#f5dce8',
  },
  iconChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: '#f5dce8',
  },
  chipText: {
    color: '#5c706c',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  inlineInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  inlineField: {
    flex: 1,
    gap: 6,
  },
  label: {
    color: '#5c706c',
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fdf5f9',
    borderColor: '#f5dce8',
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
    gap: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fdf5f9',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateButtonText: {
    flex: 1,
    color: '#2b3a42',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 16,
  },
  calendarContainer: {
    padding: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
  },
  daysOfWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayOfWeekText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#9aa',
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#2b3a42',
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    gap: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: '600',
    color: '#333',
  },
});
